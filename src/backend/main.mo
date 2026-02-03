import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Text "mo:core/Text";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Admin Bootstrap and Management

  // Bootstrap: Allow first caller to become admin if no admins exist
  public shared ({ caller }) func bootstrapAdmin() : async () {
    // Check if any admins already exist by attempting to get admin list
    // We need to track this ourselves since AccessControl doesn't expose admin count
    let admins = getAdminList();
    if (admins.size() > 0) {
      Runtime.trap("Unauthorized: Admin already exists");
    };
    // Promote caller to admin
    AccessControl.assignRole(accessControlState, caller, caller, #admin);
  };

  // Admin-only: Grant admin role to a user
  public shared ({ caller }) func grantAdminRole(user : Principal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can grant admin role");
    };
    AccessControl.assignRole(accessControlState, caller, user, #admin);
  };

  // Admin-only: Revoke admin role from a user
  public shared ({ caller }) func revokeAdminRole(user : Principal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can revoke admin role");
    };
    // Assign user role instead of admin
    AccessControl.assignRole(accessControlState, caller, user, #user);
  };

  // Admin-only: List all current admins
  public query ({ caller }) func listAdmins() : async [Principal] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can list admins");
    };
    getAdminList();
  };

  // Helper function to get list of admins
  private func getAdminList() : [Principal] {
    // We need to track admins ourselves since AccessControl doesn't expose this
    // This is a limitation - we'll need to maintain our own admin list
    // For now, we'll use the userProfiles keys and filter by role
    let allUsers = userProfiles.keys().toArray();
    let adminList = List.empty<Principal>();
    for (user in allUsers.vals()) {
      if (AccessControl.isAdmin(accessControlState, user)) {
        adminList.add(user);
      };
    };
    adminList.toArray();
  };

  // User Profile Management
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not Principal.equal(caller, user) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Contact Inquiry Management
  type Inquiry = {
    id : Nat;
    senderName : Text;
    senderEmail : Text;
    subject : Text;
    message : Text;
    company : ?Text;
    timestamp : Time.Time;
  };

  var nextId : Nat = 1;
  var inquiries : List.List<Inquiry> = List.empty<Inquiry>();

  // Public endpoint - anyone can submit an inquiry (including guests)
  public shared ({ caller }) func createInquiry(
    senderName : Text,
    senderEmail : Text,
    subject : Text,
    message : Text,
    company : ?Text,
  ) : async () {
    let newInquiry : Inquiry = {
      id = nextId;
      senderName;
      senderEmail;
      subject;
      message;
      company;
      timestamp = Time.now();
    };
    inquiries.add(newInquiry);
    nextId += 1;
  };

  // Admin-only endpoint to view all inquiries
  public query ({ caller }) func getAllInquiries() : async [Inquiry] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can access inquiries");
    };
    inquiries.toArray();
  };

  // Admin-only endpoint to filter inquiries by subject
  public query ({ caller }) func filterInquiriesBySubject(subject : Text) : async [Inquiry] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can access inquiries");
    };
    let filtered = inquiries.filter(
      func(inquiry : Inquiry) : Bool { Text.equal(inquiry.subject, subject) }
    );
    filtered.toArray();
  };

  // Admin-only endpoint to delete an inquiry
  public shared ({ caller }) func deleteInquiry(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete inquiries");
    };
    inquiries := inquiries.filter(
      func(inquiry) { inquiry.id != id }
    );
  };

  // Home Page Feature Box Management
  public type FeatureBox = {
    title : Text;
    description : Text;
    buttonLabel : Text;
    targetRoute : Text;
  };

  // Persistent store (Map) for feature boxes
  let featureBoxStore = Map.empty<Nat, FeatureBox>();
  var featureBoxNextId = 0;

  // Query endpoint to fetch all feature boxes
  public query ({ caller }) func getAllFeatureBoxes() : async [FeatureBox] {
    featureBoxStore.values().toArray();
  };

  // Admin-only endpoint to add or update a feature box
  public shared ({ caller }) func saveFeatureBox(id : ?Nat, box : FeatureBox) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can save feature boxes");
    };

    switch (id) {
      case (null) {
        let newId = featureBoxNextId;
        featureBoxStore.add(newId, box);
        featureBoxNextId += 1;
        newId;
      };
      case (?existingId) {
        if (featureBoxStore.containsKey(existingId)) {
          featureBoxStore.add(existingId, box);
          existingId;
        } else {
          Runtime.trap("FeatureBox with id does not exist");
        };
      };
    };
  };

  // Admin-only endpoint to delete a feature box
  public shared ({ caller }) func deleteFeatureBox(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete feature boxes");
    };
    featureBoxStore.remove(id);
  };
};
