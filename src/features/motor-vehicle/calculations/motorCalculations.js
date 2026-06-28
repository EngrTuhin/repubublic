export const calculateMotorPremium = (setValue, getValues, raw = null) => {
  if (!getValues) return;

  // Parse helper
  const getNum = (field) => parseFloat(getValues(field)) || 0;

  const fiv = getNum("insamt");

  if (raw) {
    // We are updating the rate fields directly from capacity selection
    setValue("basic", raw.own_dp_basic || "");
    setValue("rate", raw.full_ins_value || "");
    setValue("actl", raw.act_liability || "");
    setValue("cyclonebm_rate", raw.cyclone || "");
    setValue("earth_rate", raw.earthcue || "");
    setValue("riot_rate", raw.riot || "");
  }

  const basicAmount = raw
    ? parseFloat(raw.own_dp_basic) || 0
    : getNum("basic");
  const basicRate = raw
    ? parseFloat(raw.full_ins_value) || 0
    : getNum("rate");

  // 1. Calculate Own Damage Premium (Percentage Part)
  const odpPercentageAmount = fiv > 0 ? (fiv * basicRate) / 100 : 0;
  setValue(
    "odpamt",
    odpPercentageAmount > 0 ? odpPercentageAmount.toFixed(2) : "",
  );

  // 2. Calculate Deductible Risks
  const floodRate = raw
    ? parseFloat(raw.cyclone) || 0
    : getNum("cyclonebm_rate");
  const riotRate = raw ? parseFloat(raw.riot) || 0 : getNum("riot_rate");
  const earthRate = raw ? parseFloat(raw.earthcue) || 0 : getNum("earth_rate");

  let floodAmount = 0;
  if (getValues("cycloned")) {
    floodAmount = (fiv * floodRate) / 100;
    setValue(
      "cycloneamt",
      floodAmount > 0 ? floodAmount.toFixed(2) : "",
    );
  } else {
    setValue("cycloneamt", "");
  }

  let riotAmount = 0;
  if (getValues("riot")) {
    riotAmount = (fiv * riotRate) / 100;
    setValue("riot_amt", riotAmount > 0 ? riotAmount.toFixed(2) : "");
  } else {
    setValue("riot_amt", "");
  }

  let earthAmount = 0;
  if (getValues("earthd")) {
    earthAmount = (fiv * earthRate) / 100;
    setValue("earthamt", earthAmount > 0 ? earthAmount.toFixed(2) : "");
  } else {
    setValue("earthamt", "");
  }

  // 3. Less Excl. Perils
  const lessExclPerils = floodAmount + riotAmount + earthAmount;
  setValue(
    "less_excl",
    lessExclPerils > 0 ? lessExclPerils.toFixed(2) : "",
  );

  // 4. Annual Premium (ODP side)
  const avtsAmount = getNum("avtsamt");
  const shortPeriod = getNum("short_per"); // Might be used later
  let annualPremium = 0;
  if (basicAmount > 0 || odpPercentageAmount > 0) {
    annualPremium =
      basicAmount + odpPercentageAmount - lessExclPerils + avtsAmount;
    setValue("totprem", annualPremium.toFixed(2));
    setValue("loadtextper", annualPremium.toFixed(2)); // According to screenshot "% of Premium Tk" matches
  } else {
    setValue("totprem", "");
    setValue("loadtextper", "");
  }

  // 5. Motor Liability
  const liability = raw
    ? parseFloat(raw.act_liability) || 0
    : getNum("actl");

  // 6. Passenger
  const passengerCount = getNum("passenger");
  const passengerAmount = getNum("pamt");
  const passengerTotal = passengerCount * passengerAmount;
  if (passengerTotal > 0) {
    setValue("pas_amt", passengerTotal.toFixed(2));
  } else {
    setValue("pas_amt", "");
  }

  // 7. Driver
  const driverPaid = getNum("driver_amt");

  // 8. NCB
  const ncbPercent = getNum("ncb");
  const ncbAmount =
    annualPremium > 0 ? Math.round((annualPremium * ncbPercent) / 100) : 0;
  setValue("ncbamt", ncbAmount > 0 ? ncbAmount.toFixed(2) : "");

  // Other Loadings / Discounts
  const loadingPercent = getNum("loadper");
  const loadingAmount =
    annualPremium > 0 ? Math.round((annualPremium * loadingPercent) / 100) : 0;
  setValue("loadamt", loadingAmount > 0 ? loadingAmount.toFixed(2) : "");

  const extraLoading = getNum("ex_load_amt");
  const discountPercent = getNum("discount");
  const discountAmount =
    annualPremium > 0 ? Math.round((annualPremium * discountPercent) / 100) : 0;
  setValue(
    "disamt",
    discountAmount > 0 ? discountAmount.toFixed(2) : "",
  );

  const roadUserAmount = getNum("extra1_amt");

  // 9. Net Premium
  let netPremium = 0;
  if (annualPremium > 0 || liability > 0) {
    netPremium =
      annualPremium +
      liability +
      passengerTotal +
      driverPaid -
      ncbAmount +
      loadingAmount +
      extraLoading +
      roadUserAmount -
      discountAmount;
    setValue("premium", Math.round(netPremium).toString()); // Screenshot shows rounded Net Premium
  } else {
    setValue("premium", "");
  }

  // 10. VAT & Gross
  if (netPremium > 0) {
    const addVat = getValues("addVat");
    if (addVat) {
      const vat = Math.round(netPremium * 0.15); // Standard VAT rounding
      setValue("vat", vat.toString());
      setValue("total", (netPremium + vat).toFixed(2));
    } else {
      setValue("vat", "0.00");
      setValue("total", netPremium.toFixed(2));
    }
  } else {
    setValue("vat", "");
    setValue("total", "");
  }
};

export const triggerCalc = (e, setValue, getValues) => {
  setTimeout(() => calculateMotorPremium(setValue, getValues), 0);
};
