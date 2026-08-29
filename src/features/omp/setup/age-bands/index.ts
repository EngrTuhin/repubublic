export { useOmpAgeBands } from "./useOmpAgeBands";
export {
  ageBandsConfig,
  defaultAgeBandForm,
  formFieldsConfig,
  tableConfig,
} from "./config";
export type { OmpAgeBand, TableConfig, TableColumn } from "./config";
export {
  ageBandApi,
  useGetOmpAgeBandsQuery,
  useCreateOmpAgeBandMutation,
  useUpdateOmpAgeBandMutation,
  useDeleteOmpAgeBandMutation,
} from "./ageBandApi";
