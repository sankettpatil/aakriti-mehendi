export const HEADCOUNT_MAP: Record<string, number> = {
  '1': 1,
  '2_5': 3,
  '6_15': 10,
  '16_30': 22,
  '31_50': 40,
  '50_plus': 60
};

export const BRIDAL_BASE_TIME: Record<string, number> = {
  hands_wrist:  60,
  hands_elbow:  90,
  hands_feet:   150,
  full_bridal:  210
};

export const PER_PERSON_TIME: Record<string, number> = {
  simple:      25,
  arabic:      52,
  traditional: 82,
  intricate:   135
};

export const COVERAGE_MULTIPLIER: Record<string, number> = {
  hands_wrist:    1.0,
  hands_elbow:    1.3,
  feet:           1.2,
  hands_and_feet: 1.45,
  back_design:    1.0
};

export const COVERAGE_FLAT_ADDITIONS: Record<string, number> = {
  back_design: 30
};

export const BRIDAL_BASE_PRICE: Record<string, number> = {
  hands_wrist:  1200,
  hands_elbow:  2000,
  hands_feet:   4000,
  full_bridal:  6500
};

export const PER_PERSON_PRICE: Record<string, number> = {
  simple:      300,
  arabic:      600,
  traditional: 900,
  intricate:   1500
};

export const ADDON_PRICE: Record<string, number> = {
  glitter:         200,
  colored_mehndi:  500,
  stone_tikki:     300,
  reference_design: 0
};

export const URGENCY_SURCHARGE: Record<string, number> = {
  '7_days_plus': 0,
  '3_7_days':    0,
  '1_3_days':    0.10,
  'today_tomorrow': 0.25
};

export const TRAVEL_TIERS = [
  { maxKm: 5,   charge: 0,   label: 'Free within 5 km' },
  { maxKm: 15,  charge: 200, label: '₹200 (5–15 km)' },
  { maxKm: 25,  charge: 400, label: '₹400 (15–25 km)' },
  { maxKm: 40,  charge: 600, label: '₹600 (25–40 km)' },
  { maxKm: Infinity, charge: 0, label: 'Outstation — discussed separately' }
];

export const SETUP_BUFFER = 15;
export const BREAK_PER_3HRS = 15;
export const TOUCHUP_BUFFER = 15;

export function getCoverageImpact(coverages: string[] | string | undefined) {
  let multiplier = 0;
  let flatTimeAdd = 0;
  let flatPriceAdd = 0;
  
  if (!coverages) return { multiplier: 1, flatTimeAdd: 0, flatPriceAdd: 0 };
  
  const covs = Array.isArray(coverages) ? coverages : [coverages];
  if (covs.length === 0) return { multiplier: 1, flatTimeAdd: 0, flatPriceAdd: 0 };

  let handsMax = 0;
  let feetAdded = 0;

  covs.forEach(c => {
    if (c === 'hands_wrist') handsMax = Math.max(handsMax, 1.0);
    if (c === 'hands_elbow') handsMax = Math.max(handsMax, 1.3);
    if (c === 'hands_and_feet') handsMax = Math.max(handsMax, 1.45);
    if (c === 'feet') feetAdded += 0.2;
    if (c === 'back_design') {
      flatTimeAdd += 30;
      flatPriceAdd += 500;
    }
  });

  if (handsMax === 0 && feetAdded > 0) {
    multiplier = 0.5 + feetAdded; 
  } else {
    multiplier = (handsMax || 1.0) + feetAdded;
  }

  return { multiplier, flatTimeAdd, flatPriceAdd };
}

export function estimateDuration(formState: any): number {
  let total = 0;

  if (!formState.occasion) return 0;

  if (formState.occasion === 'bridal') {
    const scopes = Array.isArray(formState.bridal_scope) ? formState.bridal_scope : (formState.bridal_scope ? [formState.bridal_scope] : []);
    total += scopes.reduce((sum: number, scope: string) => sum + (BRIDAL_BASE_TIME[scope] || 0), 0);

    const familyCount = formState.family_headcount || 0;
    if (familyCount > 0) {
      const familyStyle = formState.family_design_style || 'arabic';
      const basePerPerson = PER_PERSON_TIME[familyStyle] || 0;
      const { multiplier, flatTimeAdd } = getCoverageImpact(formState.body_coverage);
      total += familyCount * (basePerPerson * multiplier + flatTimeAdd);
    }
  } else {
    if (!formState.headcount || !formState.design_style) return 0;
    const count = HEADCOUNT_MAP[formState.headcount] || 1;
    const basePerPerson = PER_PERSON_TIME[formState.design_style] || 0;
    const { multiplier, flatTimeAdd } = getCoverageImpact(formState.body_coverage);
    total += count * (basePerPerson * multiplier + flatTimeAdd);
  }

  // Buffers
  total += SETUP_BUFFER;
  total += TOUCHUP_BUFFER;
  const breaks = Math.floor(total / 180) * BREAK_PER_3HRS;
  total += breaks;

  return Math.ceil(total);
}

export function recommendPackage(durationMinutes: number): string {
  if (durationMinutes <= 120)  return 'quick_session';
  if (durationMinutes <= 300)  return 'half_day';
  if (durationMinutes <= 480)  return 'full_day';
  if (durationMinutes <= 720)  return 'extended_day';
  return 'multiday';
}

export const PACKAGE_LABELS: Record<string, string> = {
  quick_session: 'Quick Session (up to 2 hrs)',
  half_day:      'Half Day (2–5 hrs)',
  full_day:      'Full Day (5–8 hrs)',
  extended_day:  'Extended Day (8–12 hrs)',
  multiday:      'Multi-Day / Overnight Stay'
};

export function calculateEstimate(formState: any) {
  let subtotal = 0;
  let breakdown: { label: string, amount: number }[] = [];

  if (!formState.occasion) {
    return { breakdown, estimatedMin: 0, estimatedMax: 0, surchargeApplied: false, grandTotal: 0 };
  }

  const totalPeople = formState.occasion === 'bridal'
    ? 1 + (formState.family_headcount || 0)
    : (HEADCOUNT_MAP[formState.headcount] || 1);

  if (formState.occasion === 'bridal') {
    const scopes = Array.isArray(formState.bridal_scope) ? formState.bridal_scope : (formState.bridal_scope ? [formState.bridal_scope] : []);
    
    let bridalBase = 0;
    const scopeLabels: string[] = [];
    
    scopes.forEach((scope: string) => {
      const price = BRIDAL_BASE_PRICE[scope] || 0;
      bridalBase += price;
      scopeLabels.push(scope);
    });
    
    subtotal += bridalBase;
    if (scopeLabels.length > 0) {
      breakdown.push({ label: `Bridal mehendi (${scopeLabels.join(', ')})`, amount: bridalBase });
    }

    const familyCount = formState.family_headcount || 0;
    if (familyCount > 0) {
      const familyStyle = formState.family_design_style || 'arabic';
      const basePrice = PER_PERSON_PRICE[familyStyle] || 0;
      const { multiplier, flatPriceAdd } = getCoverageImpact(formState.body_coverage);
      const familyTotal = familyCount * (basePrice * multiplier + flatPriceAdd);
      subtotal += familyTotal;
      breakdown.push({ label: `Family members (${familyCount} × ${familyStyle})`, amount: familyTotal });
    }
  } else {
    if (formState.headcount && formState.design_style) {
      const count = HEADCOUNT_MAP[formState.headcount] || 1;
      const basePrice = PER_PERSON_PRICE[formState.design_style] || 0;
      const { multiplier, flatPriceAdd } = getCoverageImpact(formState.body_coverage);
      const groupTotal = count * (basePrice * multiplier + flatPriceAdd);
      subtotal += groupTotal;
      breakdown.push({ label: `${count} people × ${formState.design_style}`, amount: groupTotal });
    }
  }

  const selectedAddons = formState.addons || [];
  selectedAddons.forEach((addon: string) => {
    if (addon === 'reference_design') return;
    const addonPrice = ADDON_PRICE[addon] || 0;
    const addonTotal = addonPrice * totalPeople;
    subtotal += addonTotal;
    breakdown.push({ label: `${addon} (${totalPeople} × ₹${addonPrice})`, amount: addonTotal });
  });

  const surchargeRate = URGENCY_SURCHARGE[formState.booking_urgency] || 0;
  const surchargeAmount = Math.round(subtotal * surchargeRate);
  if (surchargeAmount > 0) {
    subtotal += surchargeAmount;
    breakdown.push({ label: `Last-minute surcharge (${surchargeRate * 100}%)`, amount: surchargeAmount });
  }

  const travelCharge = formState.travel_charge || 0;
  if (travelCharge > 0) {
    breakdown.push({ label: `Travel charge`, amount: travelCharge });
  }

  const grandTotal = subtotal + travelCharge;

  return {
    breakdown,
    estimatedMin: Math.round(grandTotal * 0.9),
    estimatedMax: Math.round(grandTotal * 1.15),
    surchargeApplied: surchargeRate > 0,
    grandTotal
  };
}
