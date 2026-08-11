// import { api } from "./api.config";
// import {
//   Zone,
//   CreateZoneRequest,
//   UpdateZoneRequest,
//   GetZonesQueryParams,
//   GetZonesResponse,
// } from "@/types/dto/zone.dto";
// import { buildQueryString } from "@/lib/utils/cn.utils";

// export const zonesApi = api.injectEndpoints({
//   endpoints: (builder) => ({
//     getZones: builder.query<GetZonesResponse, GetZonesQueryParams | void>({
//       query: (params) => ({
//         url: `/zone${buildQueryString(params)}`,
//         method: "GET",
//       }),
//       providesTags: ["Zones"], // Cast strictly if needed or update tagTypes in api.config.ts
//     }),
//     getZoneById: builder.query<Zone, string>({
//       query: (id) => ({
//         url: `/zone/${id}`,
//         method: "GET",
//       }),
//     }),
//     createZone: builder.mutation<Zone, CreateZoneRequest>({
//       query: (body) => ({
//         url: "/zone",
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: ["Zones"],
//     }),
//     updateZone: builder.mutation<Zone, UpdateZoneRequest>({
//       query: (body) => ({
//         url: `/zone/${body.id}`,
//         method: "PUT",
//         body,
//       }),
//       invalidatesTags: ["Zones"],
//     }),
//     deleteZone: builder.mutation<void, string>({
//       query: (id) => ({
//         url: `/zone/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Zones"],
//     })
//   }),
// });

// export const {
//   useGetZonesQuery,
//   useGetZoneByIdQuery,
//   useCreateZoneMutation,
//   useUpdateZoneMutation,
//   useDeleteZoneMutation,
// } = zonesApi;
