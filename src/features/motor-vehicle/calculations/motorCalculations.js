/**
 * Motor Insurance Premium Calculations for Admin Panel
 * Synchronized with backend MotorCalculationService and mobile app calculations.
 */

export const parseNum = (val, fallback = 0) => {
  if (typeof val === "object" && val !== null) {
    val = val.value ?? val.id ?? fallback;
  }
  const n = parseFloat(String(val ?? "").replace(/,/g, ""));
  return isNaN(n) ? fallback : n;
};

export const parseRate = (val, fallback) => {
  if (val === undefined || val === null || val === "" || val === "0" || val === 0) {
    return fallback;
  }
  const n = Math.abs(parseNum(val, fallback));
  if (n <= 0 || n > 50) {
    return fallback;
  }
  return n;
};

export const isTrue = (val) => {
  return val === true || val === "true" || val === 1 || val === "1";
};

export const isCommercialVehicle = (usage, cerType) => {
  if (usage !== undefined && usage !== null && usage !== "") {
    if (usage === 2 || usage === "2") return true;
    if (typeof usage === "object") {
      const val = usage.id ?? usage.value ?? usage.code ?? usage.name ?? "";
      const str = String(val).toLowerCase();
      if (val === 2 || val === "2" || str.includes("commercial")) return true;
    } else {
      const str = String(usage).toLowerCase();
      if (str.includes("commercial") || str === "2") return true;
    }
  }
  if (cerType && String(cerType).toLowerCase().includes("commercial")) {
    return true;
  }
  return false;
};

export function calculateMotorPremium(setValue, getValues, raw = null) {
  if (typeof getValues !== "function" || typeof setValue !== "function") return;

  const getVal = (field) => getValues(field);

  // If raw tariff payload is passed from check-vehicle-type API
  if (raw) {
    if (raw.own_dp_basic !== undefined) setValue("own_dp_basic", String(raw.own_dp_basic));
    if (raw.full_ins_value !== undefined) setValue("full_ins_value", String(raw.full_ins_value));
    if (raw.act_liability !== undefined) setValue("act_liability", String(raw.act_liability));
    if (raw.driver_rate !== undefined) setValue("driver_rate", String(raw.driver_rate));
    if (raw.passenger_rate !== undefined) setValue("passenger_rate", String(raw.passenger_rate));
    if (raw.helper_rate !== undefined) setValue("helper_rate", String(raw.helper_rate));
    if (raw.conductor_rate !== undefined) setValue("conductor_rate", String(raw.conductor_rate));
    if (raw.supervisor_rate !== undefined) setValue("supervisor_rate", String(raw.supervisor_rate));
  }

  const cov = getVal("coverage_type") || getVal("cert_type") || "";
  const rawCovStr = Array.isArray(cov)
    ? cov.join(" ")
    : typeof cov === "object" && cov !== null
      ? cov?.value || cov?.label || ""
      : cov || "";
  const covStr = String(rawCovStr).toLowerCase();
  const isComprehensive = !covStr.includes("liability") && (covStr.includes("comprehensive") || covStr === "");

  const fiv = parseNum(getVal("insamt"), 0);

  // Liabilities
  const actLiability = parseNum(getVal("act_liability"), 0);
  const driverRate = parseNum(getVal("driver_rate"), 0);
  const driverQty = parseNum(getVal("driver_qty"), 1);
  const driverLiability = driverRate * driverQty;

  const passengerRate = parseNum(getVal("passenger_rate"), 0);
  const passengerQty = parseNum(getVal("passenger_qty"), 0);
  const passengerLiability = passengerRate * passengerQty;

  const helperRate = parseNum(getVal("helper_rate"), 0);
  const helperQty = parseNum(getVal("helper_qty"), 0);
  const helperLiability = helperRate * helperQty;

  const conductorRate = parseNum(getVal("conductor_rate"), 0);
  const conductorQty = parseNum(getVal("conductor_qty"), 0);
  const conductorLiability = conductorRate * conductorQty;

  const supervisorRate = parseNum(getVal("supervisor_rate"), 0);
  const supervisorQty = parseNum(getVal("supervisor_qty"), 0);
  const supervisorLiability = supervisorRate * supervisorQty;

  const totalLiability =
    actLiability +
    driverLiability +
    passengerLiability +
    helperLiability +
    conductorLiability +
    supervisorLiability;

  let basicOd = 0;
  let effectiveFivRate = 0;
  let fivRiskAmount = 0;
  let basicOwnDamage = 0;
  let technoMeterDiscount = 0;
  let trackingDeviceDiscount = 0;
  let ncbDiscount = 0;
  let claimLoading = 0;
  let adjustedOwnDamage = 0;

  if (isComprehensive) {
    basicOd = parseNum(getVal("own_dp_basic"), 0);
    const accidentalRate = parseRate(getVal("accidental_external_means_rate"), 1.15);
    const fireRate = parseRate(getVal("fire_rate"), 0.25);
    const theftRate = parseRate(getVal("theft_rate"), 0.25);
    const floodRate = parseRate(getVal("flood_cyclone_rate") || getVal("cyclone"), 0.25);
    const riotRate = parseRate(getVal("riot_strike_rate") || getVal("riot_rate"), 0.50);
    const earthRate = parseRate(getVal("earthquake_rate") || getVal("earthcue"), 0.25);

    let activeFivRate = accidentalRate + fireRate + theftRate;
    if (isTrue(getVal("cycloned"))) activeFivRate += floodRate;
    if (isTrue(getVal("riot"))) activeFivRate += riotRate;
    if (isTrue(getVal("earthd"))) activeFivRate += earthRate;

    effectiveFivRate = Number(activeFivRate.toFixed(4));
    setValue("full_ins_value", effectiveFivRate.toString());
    setValue("effective_fiv_rate", effectiveFivRate.toString());

    fivRiskAmount = Number(((fiv * effectiveFivRate) / 100).toFixed(2));
    basicOwnDamage = Number((basicOd + fivRiskAmount).toFixed(2));

    if (isTrue(getVal("has_technometer"))) {
      const technoPct = parseRate(getVal("techno_meter_discount"), 10);
      technoMeterDiscount = Number(((basicOwnDamage * technoPct) / 100).toFixed(2));
    }

    if (isTrue(getVal("has_tracker"))) {
      const trackerPct = parseRate(getVal("tracking_device_discount"), 10);
      trackingDeviceDiscount = Number(((basicOwnDamage * trackerPct) / 100).toFixed(2));
    }

    const hasPrevInsurance = Boolean(
      isTrue(getVal("hasPreviousInsurance")) ||
      isTrue(getVal("has_previous_insurance")) ||
      (getVal("previous_insurance_no") && String(getVal("previous_insurance_no")).trim().length > 0) ||
      (getVal("prev_policy_no") && String(getVal("prev_policy_no")).trim().length > 0)
    );

    const isOnClaim =
      isTrue(getVal("ncb_1st_year")) ||
      isTrue(getVal("claim_loading_1st_time")) ||
      isTrue(getVal("claim_loading_2nd_time")) ||
      isTrue(getVal("claim_loading_3rd_time"));

    // Claim Loading:
    // 3rd time: 40%; 2nd time: 30%; 1st time: 0%; all off on claim: 50%
    if (hasPrevInsurance && isOnClaim) {
      if (isTrue(getVal("claim_loading_3rd_time"))) {
        const loadPct = parseRate(getVal("claim_loading_2nd_time_rate"), 40);
        claimLoading = Number(((basicOwnDamage * loadPct) / 100).toFixed(2));
      } else if (isTrue(getVal("claim_loading_2nd_time"))) {
        const loadPct = parseRate(getVal("claim_loading_1st_time_rate"), 30);
        claimLoading = Number(((basicOwnDamage * loadPct) / 100).toFixed(2));
      } else if (isTrue(getVal("claim_loading_1st_time"))) {
        claimLoading = 0;
      } else {
        const loadPct = parseRate(getVal("claim_loading_3rd_time_rate"), 50);
        claimLoading = Number(((basicOwnDamage * loadPct) / 100).toFixed(2));
      }
    } else {
      claimLoading = 0;
    }

    // No Claim Bonus (NCB) Discount:
    // 3rd year: 40%; 2nd year: 30%; 1st year: 0%; all off on previous insurance: 50%
    if (hasPrevInsurance) {
      if (isTrue(getVal("ncb_3rd_year"))) {
        const ncbPct = parseRate(getVal("ncb_2nd_year_rate"), 40);
        ncbDiscount = Number(((basicOwnDamage * ncbPct) / 100).toFixed(2));
      } else if (isTrue(getVal("ncb_2nd_year"))) {
        const ncbPct = parseRate(getVal("ncb_1st_year_rate"), 30);
        ncbDiscount = Number(((basicOwnDamage * ncbPct) / 100).toFixed(2));
      } else if (isTrue(getVal("ncb_1st_year")) || isOnClaim) {
        ncbDiscount = 0;
      } else {
        const ncbPct = parseRate(getVal("ncb_3rd_year_rate"), 50);
        ncbDiscount = Number(((basicOwnDamage * ncbPct) / 100).toFixed(2));
      }
    } else {
      ncbDiscount = 0;
    }

    adjustedOwnDamage = Number(
      Math.max(
        0,
        basicOwnDamage -
        technoMeterDiscount -
        trackingDeviceDiscount -
        ncbDiscount +
        claimLoading
      ).toFixed(2)
    );
  }

  const netPremium = Number(
    (isComprehensive ? adjustedOwnDamage + totalLiability : totalLiability).toFixed(2)
  );

  let vatExemptionAmount = 0;
  let vatApplicableAmount = netPremium;

  const usageVal = getVal("motor_vehicle_usage_id") || getVal("vehicle_usage");
  const cerTypeVal = getVal("motor_cer_type");
  const isComm = isCommercialVehicle(usageVal, cerTypeVal);

  if (isTrue(getVal("has_tax_exemption")) && !isComm && isComprehensive) {
    const exemptionPct = parseNum(getVal("vat_exemption_rate"), 25);
    vatExemptionAmount = Number(((netPremium * exemptionPct) / 100).toFixed(2));
    vatApplicableAmount = Math.max(0, Number((netPremium - vatExemptionAmount).toFixed(2)));
  }

  const vatAmount = Number((vatApplicableAmount * 0.15).toFixed(2));
  const totalPremium = Math.round(netPremium + vatAmount);

  // Set detailed calculation fields into form state
  setValue("fiv_risk_amount", fivRiskAmount.toString());
  setValue("basic_own_damage", basicOwnDamage.toString());
  setValue("techno_meter_discount", technoMeterDiscount.toString());
  setValue("tracking_device_discount", trackingDeviceDiscount.toString());
  setValue("ncb_discount", ncbDiscount.toString());
  setValue("claim_loading", claimLoading.toString());
  setValue("adjusted_own_damage", adjustedOwnDamage.toString());
  setValue("driver_liability", driverLiability.toString());
  setValue("passenger_liability", passengerLiability.toString());
  setValue("helper_liability", helperLiability.toString());
  setValue("conductor_liability", conductorLiability.toString());
  setValue("supervisor_liability", supervisorLiability.toString());
  setValue("total_liability", totalLiability.toString());
  setValue("totprem", netPremium.toFixed(2));
  setValue("premium", netPremium.toFixed(2));
  setValue("vat_exemption_amount", vatExemptionAmount.toFixed(2));
  setValue("vat", vatAmount.toFixed(2));
  setValue("total", totalPremium.toString());

  return {
    isComprehensive,
    fiv,
    basicOd,
    effectiveFivRate,
    fivRiskAmount,
    basicOwnDamage,
    technoMeterDiscount,
    trackingDeviceDiscount,
    ncbDiscount,
    claimLoading,
    adjustedOwnDamage,
    actLiability,
    driverLiability,
    passengerLiability,
    helperLiability,
    conductorLiability,
    supervisorLiability,
    totalLiability,
    netPremium,
    vatExemptionAmount,
    vatApplicableAmount,
    vatAmount,
    totalPremium,
  };
}

export const triggerCalc = (val, setValue, getValues) => {
  if (setValue && getValues) {
    setTimeout(() => calculateMotorPremium(setValue, getValues), 50);
  }
};
