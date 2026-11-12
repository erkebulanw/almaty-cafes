import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { getCafes, getCafe, addCafe, deleteCafe } from "../api/cafeApi.js";

// Ключи кеша: каждая комбинация фильтров/страницы = отдельная запись
export const cafesKeys = {
  all: ["cafes"],
  lists: ["cafes", "list"],
  list: (params) => ["cafes", "list", params],
  detail: (id) => ["cafes", "detail", String(id)],
};

export function useCafes(params) {
  return useQuery({
    queryKey: cafesKeys.list(params),
    // signal отменяет устаревший запрос, ответ на него не перезапишет новый
    queryFn: ({ signal }) => getCafes(params, signal),
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData, // при смене страницы показываем прошлые данные, пока грузятся новые
  });
}

export function useCafe(id) {
  return useQuery({
    queryKey: cafesKeys.detail(id),
    queryFn: ({ signal }) => getCafe(id, signal),
    staleTime: 60 * 1000,
    retry: false,
  });
}

export function useAddCafe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => addCafe(data),
    // после создания все списки считаются устаревшими и перезагружаются
    onSuccess: () => queryClient.invalidateQueries({ queryKey: cafesKeys.all }),
  });
}

export function useDeleteCafe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteCafe(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: cafesKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: cafesKeys.lists });
    },
  });
}