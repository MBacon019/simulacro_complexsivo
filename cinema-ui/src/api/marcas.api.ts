import { http } from "./http";
    
export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Show = { id: number; nombre: string };

export async function listShowsApi() {
  const { data } = await http.get<Paginated<Show>>("/api/shows/");
  return data; // { count, next, previous, results }
}

export async function createShowApi(nombre: string) {
  const { data } = await http.post<Show>("/api/shows/", { nombre });
  return data;
}

export async function updateShowApi(id: number, nombre: string) {
  const { data } = await http.put<Show>(`/api/shows/${id}/`, { nombre });
  return data;
}

export async function deleteShowApi(id: number) {
  await http.delete(`/api/shows/${id}/`);
}