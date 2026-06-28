export const menuConfig = [
  {
    title: "Operations",
    id: "operations",
    items: [
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
        ],
      },
    ],
  },
  {
    title: "Setup",
    id: "setup-group",
    items: [
      {
        id: "setup-data",
        label: "Setup Desk",
        icon: "settings",
        href: "/setup/uw-clients",
        children: [
          {
            id: "uw-clients",
            label: "Clients",
            href: "/setup/uw-clients",
          },
          {
            id: "uw-bank-infos",
            label: "Banks",
            href: "/setup/uw-bank-infos",
          },
          {
            id: "uw-bank-branches",
            label: "Branches",
            href: "/setup/uw-bank-branches",
          },
          {
            id: "uw-tarrifs",
            label: "Tariffs",
            href: "/setup/uw-tarrifs",
          },
          {
            id: "uw-drivers",
            label: "Drivers",
            href: "/setup/uw-drivers",
          },
          {
            id: "motor-certificate-types",
            label: "Certificates",
            href: "/setup/motor-certificate-types",
          },
          {
            id: "uw-limitation-uses",
            label: "Limitations",
            href: "/setup/uw-limitation-uses",
          },
        ],
      },
      // {
      //   id: "claims",
      //   label: "Claims Desk",
      //   icon: "claims",
      //   href: "/claims",
      //   children: [
      //     {
      //       id: "claims-management",
      //       label: "Claims management",
      //       href: "/claims/manage",
      //       children: [
      //         {
      //           id: "claims-new",
      //           label: "New Claims",
      //           href: "/claims/manage/new",
      //         },
      //         {
      //           id: "claims-progress",
      //           label: "In Progress",
      //           href: "/claims/manage/progress",
      //         },
      //       ],
      //     },
      //     {
      //       id: "claims-settlement",
      //       label: "Settlements",
      //       href: "/claims/settlements",
      //     },
      //   ],
      // },
      // {
      //   id: "payments",
      //   label: "Payment Oversight",
      //   icon: "payments",
      //   href: "/payments",
      //   children: [
      //     {
      //       id: "payments-billing",
      //       label: "Premium Billing",
      //       href: "/payments/billing",
      //     },
      //     {
      //       id: "payments-refunds",
      //       label: "Refund Requests",
      //       href: "/payments/refunds",
      //     },
      //   ],
      // },
    ],
  },
  // {
  //   title: "Support",
  //   id: "support",
  //   items: [
  //     {
  //       id: "communications",
  //       label: "Communication Center",
  //       icon: "communications",
  //       href: "/communications",
  //       children: [
  //         {
  //           id: "comm-messages",
  //           label: "Messages",
  //           href: "/communications/messages",
  //         },
  //         {
  //           id: "comm-tickets",
  //           label: "Support Tickets",
  //           href: "/communications/tickets",
  //         },
  //       ],
  //     },
  //     {
  //       id: "documents",
  //       label: "Document Desk",
  //       icon: "documents",
  //       href: "/documents",
  //       children: [
  //         {
  //           id: "doc-verification",
  //           label: "Client Verification",
  //           href: "/documents/verification",
  //         },
  //         {
  //           id: "doc-templates",
  //           label: "Templates & Forms",
  //           href: "/documents/templates",
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   title: "Analytics",
  //   id: "analytics",
  //   items: [
  //     {
  //       id: "analytics-reports",
  //       label: "Reports & Analytics",
  //       icon: "analytics",
  //       href: "/analytics",
  //       children: [
  //         {
  //           id: "reports-financial",
  //           label: "Financial Performance",
  //           href: "/analytics/financial",
  //         },
  //         {
  //           id: "reports-sales",
  //           label: "Sales Analysis",
  //           href: "/analytics/sales",
  //         },
  //       ],
  //     },
  //     {
  //       id: "audit",
  //       label: "Audit Logs",
  //       icon: "audit",
  //       href: "/audit",
  //     },
  //   ],
  // },
];
