import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@dfinity/principal';
import type { UserProfile, Inquiry, FeatureBox } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin Authorization Queries
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

// Admin Management Queries
export function useListAdmins() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Principal[]>({
    queryKey: ['admins'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listAdmins();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGrantAdminRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.grantAdminRole(principal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });
}

export function useRevokeAdminRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.revokeAdminRole(principal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });
}

// Inquiry Mutations
export function useCreateInquiry() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: {
      senderName: string;
      senderEmail: string;
      subject: string;
      message: string;
      company: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createInquiry(
        data.senderName,
        data.senderEmail,
        data.subject,
        data.message,
        data.company
      );
    },
  });
}

// Admin Inquiry Queries
export function useGetAllInquiries() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Inquiry[]>({
    queryKey: ['inquiries'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllInquiries();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useDeleteInquiry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteInquiry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    },
  });
}

// Feature Box Queries
export function useGetAllFeatureBoxes() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<FeatureBox[]>({
    queryKey: ['featureBoxes'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllFeatureBoxes();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveFeatureBox() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: bigint | null; box: FeatureBox }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveFeatureBox(data.id, data.box);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featureBoxes'] });
    },
  });
}
