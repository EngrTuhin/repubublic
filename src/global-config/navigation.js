export const menuConfig = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "userCheck",
    href: "/dashboard",
  },
  {
    id: "underwriting",
    label: "Underwriting Desk",
    icon: "underwriting",
    href: "/underwriting",
    children: [
      {
        id: "uw-motor-vehicle",
        label: "Motor Vehicle",
        href: "/underwriting/motor-vehicle",
      },
      {
        id: "uw-omp",
        label: "Overseas Mediclaim",
        href: "/underwriting/omp",
      },
      {
        id: "uw-personal-accident",
        label: "Personal Accident",
        href: "/underwriting/personal-accident",
      },
    ],
  },
  {
    id: "claims-desk",
    label: "Claims Settlement",
    icon: "fileText",
    href: "/claims",
  },

  {
    id: "product-features",
    label: "Product Feature",
    icon: "sparkles",
    href: "/product-features",
  },
  {
    id: "advertisements",
    label: "Advertisement",
    icon: "advertisement",
    href: "/advertisements",
  },
  {
    id: "setup-data",
    label: "Setup Desk",
    icon: "settings",
    href: "/setup/motor-setup/tariff-types",
    children: [
      {
        id: "motor-setup",
        label: "Motor Setup",
        href: "/setup/motor-setup/tariff-types",
        children: [
          {
            id: "motor-tariff-types",
            label: "Tariff Types",
            href: "/setup/motor-setup/tariff-types",
          },
          {
            id: "motor-tariff-groups",
            label: "Tariff Groups",
            href: "/setup/motor-setup/tariff-groups",
          },
          {
            id: "motor-class-sub-types",
            label: "Class Sub Types",
            href: "/setup/motor-setup/class-sub-types",
          },
          {
            id: "motor-tariffs",
            label: "Motor Tariffs",
            href: "/setup/motor-setup/tariffs",
          },
          {
            id: "motor-vehicle-usages",
            label: "Vehicle Usages",
            href: "/setup/motor-setup/vehicle-usages",
          },
          // {
          //   id: "motor-certificate-types",
          //   label: "Certificates",
          //   href: "/setup/motor-certificate-types",
          // },
          // {
          //   id: "uw-drivers",
          //   label: "Drivers",
          //   href: "/setup/uw-drivers",
          // },
          // {
          //   id: "uw-limitation-uses",
          //   label: "Limitations",
          //   href: "/setup/uw-limitation-uses",
          // },
        ],
      },
      {
        id: "omp-setup",
        label: "OMP Setup",
        href: "/setup/omp-setup/age-bands",
        children: [
          {
            id: "omp-age-bands",
            label: "Age Bands",
            href: "/setup/omp-setup/age-bands",
          },
          {
            id: "omp-country-options",
            label: "Country Options",
            href: "/setup/omp-setup/country-options",
          },
          {
            id: "omp-plan-options",
            label: "Plan Options",
            href: "/setup/omp-setup/plan-options",
          },
          {
            id: "omp-policy-types",
            label: "Policy Types",
            href: "/setup/omp-setup/policy-types",
          },
          {
            id: "omp-tariffs",
            label: "Tariffs",
            href: "/setup/omp-setup/tariffs",
          },
        ],
      },
      {
        id: "pa-setup",
        label: "PA Setup",
        href: "/setup/pa-setup/occupations",
        children: [
          {
            id: "pa-occupations",
            label: "PA Occupations",
            href: "/setup/pa-setup/occupations",
          },
          {
            id: "pa-table-types",
            label: "PA Table Types",
            href: "/setup/pa-setup/table-types",
          },
          {
            id: "pa-tariffs",
            label: "PA Tariffs",
            href: "/setup/pa-setup/tariffs",
          },
        ],
      },
      {
        id: "uw-clients",
        label: "Clients",
        href: "/setup/uw-clients",
      },
      {
        id: "system-settings",
        label: "Company Settings",
        href: "/setup/system-settings",
      },
      // {
      //   id: "uw-bank-infos",
      //   label: "Banks",
      //   href: "/setup/uw-bank-infos",
      // },
      // {
      //   id: "uw-bank-branches",
      //   label: "Branches",
      //   href: "/setup/uw-bank-branches",
      // },
    ],
  },
  {
    id: "reports-desk",
    label: "Reports Desk",
    icon: "fileText",
    href: "/reports/proposal",
    children: [
      { id: "rpt-proposal", label: "Proposal Report", href: "/reports/proposal" },
      { id: "rpt-collection", label: "Premium Collection", href: "/reports/collection" },
      { id: "rpt-product", label: "Product-Wise Business", href: "/reports/product" },
      { id: "rpt-officer", label: "Officer Performance", href: "/reports/officer" },
      { id: "rpt-payment", label: "Payment Tracking", href: "/reports/payment" },
      { id: "rpt-certificate", label: "Certificates Feed", href: "/reports/certificate" },
      { id: "rpt-renewal", label: "Policy Renewals", href: "/reports/renewal" },
      { id: "rpt-claim", label: "Claim Settlement", href: "/reports/claim" },
      { id: "rpt-customer", label: "Customer Database", href: "/reports/customer" },
      // { id: "rpt-tariff", label: "Tariff Audit Trail", href: "/reports/tariff" },
    ],
  },
];
