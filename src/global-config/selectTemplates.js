export const motorCertificateTypeTemplate = (res) => {
  if (!Array.isArray(res)) return [];
  return res.map((item) => ({
    label: `${item?.description ?? ""} (${item?.name ?? ""})`,
    value: String(item?.name ?? ""),
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
  // Ensure unique bank names in list
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
    // Check if it's an array of strings (from vehicleTypes endpoint)
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
