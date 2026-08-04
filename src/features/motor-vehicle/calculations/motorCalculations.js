export const calculateMotorPremium = (setValue, getValues, raw = null) => {
  if (!getValues) return;

  // Parse helper
  const getNum = (field) => parseFloat(getValues(field)) || 0;

  const fiv = getNum("insamt");

  if (raw) {
    // We are updating the rate fields directly from capacity selection
    setValue("basic", raw.own_dp_basic || "");
    setValue("own_dp_basic", raw.own_dp_basic || "");
    setValue("rate", raw.full_ins_value || "");
    setValue("full_ins_value", raw.full_ins_value || "");
    setValue("actl", raw.act_liability || "");
    setValue("act_liability", raw.act_liability || "");
    setValue("cyclonebm_rate", raw.cyclone || "");
    setValue("cyclone", raw.cyclone || "");
    setValue("earth_rate", raw.earthcue || "");
    setValue("earthcue", raw.earthcue || "");
    setValue("riot_rate", raw.riot || 0.5);
    setValue("driver_rate", raw.driver_rate || "");
    setValue("passenger_rate", raw.passenger_rate || "");
    setValue("helper_rate", raw.helper_rate || "");
    setValue("conductor_rate", raw.conductor_rate || "");
    setValue("supervisor_rate", raw.supervisor_rate || "");
  }

  const basicAmount = raw
    ? parseFloat(raw.own_dp_basic) || 0
    : (getNum("own_dp_basic") || getNum("basic"));
  const basicRate = raw
    ? parseFloat(raw.full_ins_value) || 0
    : (getNum("full_ins_value") || getNum("rate"));

  // 1. Calculate Own Damage Premium (Percentage Part)
  const odpPercentageAmount = fiv > 0 ? (fiv * basicRate) / 100 : 0;
  setValue(
    "odpamt",
    odpPercentageAmount > 0 ? odpPercentageAmount.toFixed(2) : "",
  );

  // 2. Calculate Perils
  const floodRate = raw
    ? (parseFloat(raw.cyclone) || 0.25)
    : (getNum("cyclone") || getNum("cyclonebm_rate") || 0.25);
  const riotRate = raw
    ? (parseFloat(raw.riot) || 0.5)
    : (getNum("riot_rate") || 0.5);
  const earthRate = raw
    ? (parseFloat(raw.earthcue) || 0.25)
    : (getNum("earthcue") || getNum("earth_rate") || 0.25);

  setValue("cyclonebm_rate", floodRate.toString());
  setValue("riot_rate", riotRate.toString());
  setValue("earth_rate", earthRate.toString());

  let floodAmount = 0;
  if (getValues("cycloned")) {
    floodAmount = (fiv * floodRate) / 100;
    setValue("cycloneamt", floodAmount > 0 ? floodAmount.toFixed(2) : "");
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

  // 3. Perils total
  const lessExclPerils = floodAmount + riotAmount + earthAmount;
  setValue("less_excl", lessExclPerils > 0 ? lessExclPerils.toFixed(2) : "");

  // 4. Annual Premium (ODP side)
  const avtsAmount = getNum("avtsamt");
  let annualPremium = 0;
  if (basicAmount > 0 || odpPercentageAmount > 0) {
    annualPremium = basicAmount + odpPercentageAmount + lessExclPerils + avtsAmount;
    setValue("totprem", annualPremium.toFixed(2));
    setValue("loadtextper", annualPremium.toFixed(2));
  } else {
    setValue("totprem", "");
    setValue("loadtextper", "");
  }

  // 5. Motor Liability
  const liability = raw
    ? parseFloat(raw.act_liability) || 0
    : (getNum("act_liability") || getNum("actl"));

  // 6. Personnel Premiums
  const driverRate = getNum("driver_rate");
  const driverQty = getNum("driver_qty") || getNum("driver") || 0;
  const driverTotal = driverRate > 0 ? driverQty * driverRate : getNum("driver_amt");

  const passengerRate = getNum("passenger_rate");
  const passengerQty = getNum("passenger_qty") || getNum("passenger") || 0;
  const passengerTotal = passengerRate > 0 ? passengerQty * passengerRate : (getNum("passenger") * getNum("pamt"));

  const helperRate = getNum("helper_rate");
  const helperQty = getNum("helper_qty") || 0;
  const helperTotal = helperQty * helperRate;

  const conductorRate = getNum("conductor_rate");
  const conductorQty = getNum("conductor_qty") || 0;
  const conductorTotal = conductorQty * conductorRate;

  const supervisorRate = getNum("supervisor_rate");
  const supervisorQty = getNum("supervisor_qty") || 0;
  const supervisorTotal = supervisorQty * supervisorRate;

  const personnelTotal = driverTotal + passengerTotal + helperTotal + conductorTotal + supervisorTotal;

  if (passengerTotal > 0) {
    setValue("pas_amt", passengerTotal.toFixed(2));
  }
  if (driverTotal > 0) {
    setValue("driver_amt", driverTotal.toFixed(2));
  }

  // 7. NCB
  const ncbPercent = getNum("ncb");
  const ncbAmount = annualPremium > 0 ? Math.round((annualPremium * ncbPercent) / 100) : 0;
  setValue("ncbamt", ncbAmount > 0 ? ncbAmount.toFixed(2) : "");

  // 8. Loadings / Discounts
  const loadingPercent = getNum("loadper");
  const loadingAmount = annualPremium > 0 ? Math.round((annualPremium * loadingPercent) / 100) : 0;
  setValue("loadamt", loadingAmount > 0 ? loadingAmount.toFixed(2) : "");

  const extraLoading = getNum("ex_load_amt");
  const discountPercent = getNum("discount");
  const discountAmount = annualPremium > 0 ? Math.round((annualPremium * discountPercent) / 100) : 0;
  setValue("disamt", discountAmount > 0 ? discountAmount.toFixed(2) : "");

  const roadUserAmount = getNum("extra1_amt");

  // 9. Net Premium
  let netPremium = 0;
  if (annualPremium > 0 || liability > 0) {
    netPremium =
      annualPremium +
      liability +
      personnelTotal -
      ncbAmount +
      loadingAmount +
      extraLoading +
      roadUserAmount -
      discountAmount;
    setValue("premium", Math.round(netPremium).toString());
    setValue("totprem", netPremium.toFixed(2));
  }

  // 10. VAT & Gross Total
  if (netPremium > 0) {
    const addVat = getValues("addVat") !== false;
    if (addVat) {
      const vat = netPremium * 0.15;
      setValue("vat", vat.toFixed(2));
      setValue("total", (netPremium + vat).toFixed(2));
    } else {
      setValue("vat", "0.00");
      setValue("total", netPremium.toFixed(2));
    }
  } else {
    setValue("vat", "0.00");
    setValue("total", "0.00");
  }
};

export const triggerCalc = (e, setValue, getValues) => {
  setTimeout(() => calculateMotorPremium(setValue, getValues), 0);
};
