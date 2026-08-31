export const commonSelectTemplate = (res, labelKey = "name", valueKey = "id", responseKey = "") => {
  let list = res;
  if (!Array.isArray(list)) {
    if (list && responseKey && Array.isArray(list[responseKey])) {
      list = list[responseKey];
    } else if (list && Array.isArray(list.data)) {
      list = list.data;
    } else {
      return [];
    }
  }

  return list.map((item) => {
    if (typeof item !== "object" || item === null) {
      return {
        label: String(item),
        value: String(item),
        raw: item,
      };
    }

    const label = (labelKey && item[labelKey] !== undefined)
      ? item[labelKey]
      : (item.label ?? item.title ?? item.name ?? item.id ?? "");

    const value = (valueKey && item[valueKey] !== undefined)
      ? item[valueKey]
      : (item.value ?? item.id ?? label);

    return {
      label: String(label).trim(),
      value: String(value).trim(),
      raw: item,
    };
  });
};

export const commonTemplate = commonSelectTemplate;

export const motorCertificateTypeTemplate = (res) => {
  if (!Array.isArray(res)) return [];
  return res.map((item) => ({
    label: `${item?.description ?? item?.name ?? ""} (${item?.name ?? ""})`,
    value: String(item?.description ?? item?.name ?? ""),
    raw: item,
  }));
};

export const clientSearchTemplate = (res) => {
  if (!Array.isArray(res)) return [];
  return res.map((item) => ({
    label: `${item?.clname ?? ""}`,
    value: String(item?.clname ?? ""),
    raw: item,
  }));
};

export const bankSearchTemplate = (res) => {
  if (!Array.isArray(res)) return [];
  const uniqueBanks = [];
  const map = new Map();
  for (const item of res) {
    if (!map.has(item.bankname)) {
      map.set(item.bankname, true);
      uniqueBanks.push(item);
    }
  }
  return uniqueBanks.map((item) => ({
    label: `${item?.bankname ?? ""}`,
    value: String(item?.bankname ?? ""),
    raw: item,
  }));
};

export const branchSearchTemplate = (res) => {
  if (!Array.isArray(res)) return [];
  return res.map((item) => ({
    label: `${item?.bankbranch ?? ""}`,
    value: String(item?.bankbranch ?? ""),
    raw: item,
  }));
};

export const certificateTypeSearchTemplate = (res) => {
  if (!Array.isArray(res)) return [];
  return res.map((item) => ({
    label: `${item?.name ?? ""}`,
    value: String(item?.name ?? ""),
    raw: item,
  }));
};

export const limitationUseSearchTemplate = (res) => {
  if (!Array.isArray(res)) return [];
  return res.map((item) => ({
    label: `${item?.name ?? ""}`,
    value: String(item?.name ?? ""),
    raw: item,
  }));
};

export const tariffTypeTemplate = (res) => {
  if (!Array.isArray(res)) return [];
  return res.map((item) => ({
    label: `${item.tmtype}`,
    value: String(item.tmtype),
    raw: item,
  }));
};

export const groupOfVehicleTemplate = (res) => {
  if (!Array.isArray(res)) return [];
  return res.map((item) => ({
    label: `${item.fname}`,
    value: String(item.fname),
    raw: item,
  }));
};

export const typeOfVehicleTemplate = (res) => {
  if (!Array.isArray(res)) return [];
  return res.map((item) => {
    if (typeof item === "string") {
      return {
        label: item.trim(),
        value: item.trim(),
        raw: { name: item.trim() },
      };
    }
    return {
      label: `${item?.name ?? ""}`.trim(),
      value: String(item?.name ?? "").trim(),
      raw: item,
    };
  });
};

export const capacityTemplate = (res) => {
  if (!Array.isArray(res)) return [];
  return res.map((item) => ({
    label: `${item?.catagoary ?? ""}`.trim(),
    value: String(item?.catagoary ?? "").trim(),
    raw: item,
  }));
};

export const driverSearchTemplate = (res) => {
  if (!Array.isArray(res)) return [];
  return res.map((item) => ({
    label: `${item?.name ?? ""}`,
    value: String(item?.name ?? ""),
    raw: item,
  }));
};

export const ompPolicyTypeTemplate = (res) => {
  if (!Array.isArray(res)) return [];
  return res.map((item) => ({
    label: item?.label || item?.policy_type_title || item?.name || `Policy Type #${item.id}`,
    value: item?.id !== undefined ? String(item.id) : String(item?.value ?? ""),
    raw: item,
  }));
};

export const ompPlanOptionTemplate = (res) => {
  if (!Array.isArray(res)) return [];
  return res.map((item) => ({
    label: item?.label || item?.plan_title || item?.name || `Plan #${item.id}`,
    value: item?.id !== undefined ? String(item.id) : String(item?.value ?? ""),
    raw: item,
  }));
};

export const paOccupationTemplate = (res) => {
  if (!Array.isArray(res)) return [];
  return res.map((item) => ({
    label: item?.label ? `${item.label} (${item.risk_class || ''})` : `Occupation #${item.id}`,
    value: item?.id !== undefined ? String(item.id) : String(item?.value ?? ""),
    raw: item,
  }));
};

export const paTableTypeTemplate = (res) => {
  if (!Array.isArray(res)) return [];
  return res.map((item) => ({
    label: item?.label || item?.value || `Table #${item.id}`,
    value: item?.id !== undefined ? String(item.id) : String(item?.value ?? ""),
    raw: item,
  }));
};
