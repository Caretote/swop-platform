import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding SWOP platform...");

  // Organization
  const org = await prisma.organization.upsert({
    where: { id: "org_acme" },
    update: {},
    create: {
      id: "org_acme",
      name: "Acme Corp",
      industry: "Enterprise SaaS",
      fiscalYear: "FY2026",
    },
  });

  // Users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@acme.com" },
      update: {},
      create: { email: "admin@acme.com", name: "Alex Chen", role: "ADMIN", organizationId: org.id },
    }),
    prisma.user.upsert({
      where: { email: "planner@acme.com" },
      update: {},
      create: { email: "planner@acme.com", name: "Jordan Lee", role: "PLANNER", organizationId: org.id },
    }),
    prisma.user.upsert({
      where: { email: "hrbp@acme.com" },
      update: {},
      create: { email: "hrbp@acme.com", name: "Sam Rivera", role: "HRBP", organizationId: org.id },
    }),
  ]);

  // Business Units
  const buData = [
    { id: "bu_sales", name: "Sales", code: "SALES", headCount: 580, budget: 62_000_000, location: ["San Francisco", "New York", "Chicago"] },
    { id: "bu_eng", name: "Engineering", code: "ENG", headCount: 720, budget: 95_000_000, location: ["San Francisco", "Seattle", "Austin"] },
    { id: "bu_mktg", name: "Marketing", code: "MKTG", headCount: 210, budget: 28_000_000, location: ["New York", "Los Angeles"] },
    { id: "bu_ops", name: "Operations", code: "OPS", headCount: 340, budget: 38_000_000, location: ["Chicago", "Denver", "Phoenix"] },
    { id: "bu_fin", name: "Finance", code: "FIN", headCount: 180, budget: 21_000_000, location: ["New York", "San Francisco"] },
    { id: "bu_cs", name: "Customer Success", code: "CS", headCount: 370, budget: 42_000_000, location: ["San Francisco", "New York", "London"] },
  ];

  const bus = await Promise.all(
    buData.map((bu) =>
      prisma.businessUnit.upsert({
        where: { id: bu.id },
        update: { headCount: bu.headCount, budget: bu.budget },
        create: { ...bu, organizationId: org.id },
      })
    )
  );

  const buMap = Object.fromEntries(bus.map((bu) => [bu.code, bu]));

  // Roles
  const rolesData = [
    // SALES
    { title: "Enterprise Account Executive", jobFamily: "Sales", gradeLevel: "L5", businessUnitId: buMap.SALES.id, salaryBand: { min: 130000, mid: 155000, max: 180000 }, skills: ["Enterprise Sales", "CRM", "Solution Selling"], aiRiskScore: 0.22, attritionRisk: 0.31 },
    { title: "Sales Development Representative", jobFamily: "Sales", gradeLevel: "L2", businessUnitId: buMap.SALES.id, salaryBand: { min: 55000, mid: 65000, max: 75000 }, skills: ["Prospecting", "Outreach", "CRM"], aiRiskScore: 0.68, attritionRisk: 0.45, isOpen: true },
    { title: "Sales Manager", jobFamily: "Sales Leadership", gradeLevel: "L6", businessUnitId: buMap.SALES.id, salaryBand: { min: 160000, mid: 185000, max: 215000 }, skills: ["Team Leadership", "Forecasting", "Coaching"], aiRiskScore: 0.15, attritionRisk: 0.22 },
    { title: "Solutions Engineer", jobFamily: "Sales Engineering", gradeLevel: "L4", businessUnitId: buMap.SALES.id, salaryBand: { min: 115000, mid: 138000, max: 162000 }, skills: ["Technical Demo", "Integration", "API"], aiRiskScore: 0.18, attritionRisk: 0.28 },
    { title: "VP of Sales", jobFamily: "Sales Leadership", gradeLevel: "L8", businessUnitId: buMap.SALES.id, salaryBand: { min: 250000, mid: 300000, max: 380000 }, skills: ["Strategy", "Executive Presence", "P&L"], aiRiskScore: 0.05, attritionRisk: 0.18 },
    { title: "Revenue Operations Analyst", jobFamily: "Revenue Operations", gradeLevel: "L3", businessUnitId: buMap.SALES.id, salaryBand: { min: 72000, mid: 88000, max: 105000 }, skills: ["Salesforce", "SQL", "Analytics"], aiRiskScore: 0.55, attritionRisk: 0.32, isOpen: true },
    // ENGINEERING
    { title: "Senior Software Engineer", jobFamily: "Engineering", gradeLevel: "L5", businessUnitId: buMap.ENG.id, salaryBand: { min: 175000, mid: 210000, max: 250000 }, skills: ["Python", "Distributed Systems", "API Design"], aiRiskScore: 0.25, attritionRisk: 0.35 },
    { title: "Staff Engineer", jobFamily: "Engineering", gradeLevel: "L7", businessUnitId: buMap.ENG.id, salaryBand: { min: 240000, mid: 285000, max: 340000 }, skills: ["Architecture", "System Design", "Mentorship"], aiRiskScore: 0.12, attritionRisk: 0.20 },
    { title: "ML Engineer", jobFamily: "AI/ML", gradeLevel: "L5", businessUnitId: buMap.ENG.id, salaryBand: { min: 195000, mid: 230000, max: 280000 }, skills: ["PyTorch", "LLMs", "MLOps"], aiRiskScore: 0.15, attritionRisk: 0.40, isOpen: true },
    { title: "Product Manager", jobFamily: "Product", gradeLevel: "L5", businessUnitId: buMap.ENG.id, salaryBand: { min: 155000, mid: 185000, max: 220000 }, skills: ["Product Strategy", "Roadmapping", "User Research"], aiRiskScore: 0.20, attritionRisk: 0.30 },
    { title: "Engineering Manager", jobFamily: "Engineering Leadership", gradeLevel: "L6", businessUnitId: buMap.ENG.id, salaryBand: { min: 210000, mid: 250000, max: 295000 }, skills: ["Technical Leadership", "Hiring", "Agile"], aiRiskScore: 0.10, attritionRisk: 0.22 },
    { title: "Data Engineer", jobFamily: "Data", gradeLevel: "L4", businessUnitId: buMap.ENG.id, salaryBand: { min: 140000, mid: 168000, max: 200000 }, skills: ["Spark", "dbt", "Airflow", "SQL"], aiRiskScore: 0.40, attritionRisk: 0.33, isOpen: true },
    // MARKETING
    { title: "Demand Generation Manager", jobFamily: "Marketing", gradeLevel: "L5", businessUnitId: buMap.MKTG.id, salaryBand: { min: 115000, mid: 138000, max: 165000 }, skills: ["Marketo", "Paid Media", "ABM"], aiRiskScore: 0.45, attritionRisk: 0.28 },
    { title: "Content Strategist", jobFamily: "Content", gradeLevel: "L4", businessUnitId: buMap.MKTG.id, salaryBand: { min: 85000, mid: 100000, max: 120000 }, skills: ["SEO", "Copywriting", "Content Strategy"], aiRiskScore: 0.60, attritionRisk: 0.35, isOpen: true },
    { title: "VP Marketing", jobFamily: "Marketing Leadership", gradeLevel: "L8", businessUnitId: buMap.MKTG.id, salaryBand: { min: 220000, mid: 265000, max: 320000 }, skills: ["Brand Strategy", "Executive Leadership", "Budget Management"], aiRiskScore: 0.08, attritionRisk: 0.15 },
    // OPS
    { title: "Operations Manager", jobFamily: "Operations", gradeLevel: "L5", businessUnitId: buMap.OPS.id, salaryBand: { min: 95000, mid: 115000, max: 140000 }, skills: ["Process Improvement", "Six Sigma", "Project Management"], aiRiskScore: 0.35, attritionRisk: 0.25 },
    { title: "Business Analyst", jobFamily: "Analytics", gradeLevel: "L3", businessUnitId: buMap.OPS.id, salaryBand: { min: 68000, mid: 82000, max: 98000 }, skills: ["SQL", "Tableau", "Process Analysis"], aiRiskScore: 0.50, attritionRisk: 0.30, isOpen: true },
    { title: "Supply Chain Analyst", jobFamily: "Supply Chain", gradeLevel: "L3", businessUnitId: buMap.OPS.id, salaryBand: { min: 65000, mid: 78000, max: 95000 }, skills: ["ERP", "Forecasting", "Logistics"], aiRiskScore: 0.55, attritionRisk: 0.28 },
    // FINANCE
    { title: "Financial Analyst", jobFamily: "Finance", gradeLevel: "L3", businessUnitId: buMap.FIN.id, salaryBand: { min: 75000, mid: 92000, max: 110000 }, skills: ["Financial Modeling", "Excel", "FP&A"], aiRiskScore: 0.58, attritionRisk: 0.32, isOpen: true },
    { title: "Controller", jobFamily: "Accounting", gradeLevel: "L7", businessUnitId: buMap.FIN.id, salaryBand: { min: 190000, mid: 225000, max: 270000 }, skills: ["GAAP", "Audit", "ERP"], aiRiskScore: 0.20, attritionRisk: 0.18 },
    { title: "CFO", jobFamily: "Finance Leadership", gradeLevel: "L9", businessUnitId: buMap.FIN.id, salaryBand: { min: 350000, mid: 420000, max: 520000 }, skills: ["Capital Markets", "M&A", "Board Reporting"], aiRiskScore: 0.05, attritionRisk: 0.12 },
    // CUSTOMER SUCCESS
    { title: "Customer Success Manager", jobFamily: "Customer Success", gradeLevel: "L4", businessUnitId: buMap.CS.id, salaryBand: { min: 90000, mid: 110000, max: 132000 }, skills: ["Relationship Management", "Gainsight", "Renewal Management"], aiRiskScore: 0.28, attritionRisk: 0.38 },
    { title: "Technical Support Engineer", jobFamily: "Support", gradeLevel: "L3", businessUnitId: buMap.CS.id, salaryBand: { min: 70000, mid: 85000, max: 102000 }, skills: ["Troubleshooting", "API", "SQL"], aiRiskScore: 0.62, attritionRisk: 0.42, isOpen: true },
    { title: "VP Customer Success", jobFamily: "CS Leadership", gradeLevel: "L8", businessUnitId: buMap.CS.id, salaryBand: { min: 230000, mid: 275000, max: 330000 }, skills: ["Retention Strategy", "Executive Relationships", "Team Building"], aiRiskScore: 0.08, attritionRisk: 0.16 },
    // Digital Labor roles
    { title: "AI Sales Agent (Agentforce)", jobFamily: "Digital Labor", gradeLevel: "AGENT", businessUnitId: buMap.SALES.id, salaryBand: { min: 0, mid: 0, max: 0 }, skills: ["Prospecting", "Lead Qualification", "CRM Update"], aiRiskScore: 0, attritionRisk: 0, isDigitalLabor: true, fteEquivalent: 4.2 },
    { title: "AI Service Agent (Agentforce)", jobFamily: "Digital Labor", gradeLevel: "AGENT", businessUnitId: buMap.CS.id, salaryBand: { min: 0, mid: 0, max: 0 }, skills: ["Ticket Triage", "FAQ Resolution", "Escalation Routing"], aiRiskScore: 0, attritionRisk: 0, isDigitalLabor: true, fteEquivalent: 8.5 },
  ];

  const roles: any[] = [];
  for (const r of rolesData) {
    const role = await prisma.role.upsert({
      where: { id: `role_${r.title.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 40)}` },
      update: {},
      create: {
        id: `role_${r.title.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 40)}`,
        location: r.businessUnitId === buMap.SALES.id ? ["San Francisco", "New York"] : ["San Francisco"],
        fteEquivalent: (r as any).fteEquivalent ?? 1.0,
        isDigitalLabor: (r as any).isDigitalLabor ?? false,
        isOpen: (r as any).isOpen ?? false,
        ...r,
      },
    });
    roles.push(role);
  }

  // Workforce Plans
  const plansData = [
    { id: "plan_fy26_annual", name: "FY2026 Annual Workforce Plan", type: "ANNUAL" as const, fiscalYear: "FY2026", status: "ACTIVE" as const },
    { id: "plan_fy26_q2", name: "Q2 2026 Headcount Plan", type: "QUARTERLY" as const, fiscalYear: "FY2026", status: "APPROVED" as const },
    { id: "plan_fy26_ai", name: "AI Transformation Initiative FY2026", type: "AI_TRANSFORMATION" as const, fiscalYear: "FY2026", status: "IN_REVIEW" as const },
    { id: "plan_fy28_3yr", name: "3-Year Strategic Plan 2026-2028", type: "THREE_YEAR_STRATEGIC" as const, fiscalYear: "FY2026", status: "DRAFT" as const },
  ];

  const plans: any[] = [];
  for (const p of plansData) {
    const plan = await prisma.workforcePlan.upsert({
      where: { id: p.id },
      update: {},
      create: { ...p, organizationId: org.id, createdBy: users[0].id },
    });
    plans.push(plan);
  }

  // Scenarios per plan
  const scenarioTypes = ["BASE", "OPTIMISTIC", "CONSERVATIVE"] as const;
  for (const plan of plans) {
    for (const type of scenarioTypes) {
      const delta = type === "OPTIMISTIC" ? 120 : type === "CONSERVATIVE" ? -20 : 60;
      await prisma.scenario.upsert({
        where: { id: `scen_${plan.id}_${type.toLowerCase()}` },
        update: {},
        create: {
          id: `scen_${plan.id}_${type.toLowerCase()}`,
          name: `${type.charAt(0) + type.slice(1).toLowerCase()} Case`,
          type,
          assumptions: { revenueGrowth: type === "OPTIMISTIC" ? 0.25 : type === "CONSERVATIVE" ? 0.05 : 0.15, attrition: 0.08 },
          headcountDelta: delta,
          budgetImpact: delta * 180000,
          riskScore: type === "OPTIMISTIC" ? 0.35 : type === "CONSERVATIVE" ? 0.15 : 0.22,
          planId: plan.id,
        },
      });
    }
  }

  // Milestones
  const milestoneData = [
    { planId: plans[0].id, title: "Headcount baseline finalized", dueDate: new Date("2026-01-31"), status: "COMPLETE" as const, owner: "Jordan Lee" },
    { planId: plans[0].id, title: "Q1 hiring targets approved by Finance", dueDate: new Date("2026-02-15"), status: "COMPLETE" as const, owner: "Alex Chen" },
    { planId: plans[0].id, title: "Q2 hiring pipeline launched", dueDate: new Date("2026-03-31"), status: "IN_PROGRESS" as const, owner: "Sam Rivera" },
    { planId: plans[0].id, title: "Mid-year plan review", dueDate: new Date("2026-06-30"), status: "NOT_STARTED" as const, owner: "Jordan Lee" },
    { planId: plans[2].id, title: "Agentforce pilot (Sales SDR automation)", dueDate: new Date("2026-03-01"), status: "IN_PROGRESS" as const, owner: "Alex Chen" },
    { planId: plans[2].id, title: "AI readiness assessment complete", dueDate: new Date("2026-04-15"), status: "AT_RISK" as const, owner: "Sam Rivera" },
  ];

  for (const m of milestoneData) {
    await prisma.milestone.upsert({
      where: { id: `ms_${m.title.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 40)}` },
      update: {},
      create: { id: `ms_${m.title.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 40)}`, ...m },
    });
  }

  // Plan Snapshots (12 months of history)
  const periods = ["2025-Q1", "2025-Q2", "2025-Q3", "2025-Q4", "2026-Q1", "2026-Q2"];
  const hcByBU: Record<string, number[]> = {
    [buMap.SALES.id]: [510, 528, 545, 562, 580, 595],
    [buMap.ENG.id]: [650, 670, 688, 702, 720, 738],
    [buMap.MKTG.id]: [190, 195, 200, 205, 210, 215],
    [buMap.OPS.id]: [310, 318, 325, 332, 340, 348],
    [buMap.FIN.id]: [168, 170, 174, 177, 180, 183],
    [buMap.CS.id]: [330, 340, 350, 360, 370, 382],
  };

  for (const buId of Object.keys(hcByBU)) {
    for (let i = 0; i < periods.length; i++) {
      const hc = hcByBU[buId][i];
      await prisma.planSnapshot.upsert({
        where: { id: `snap_${buId}_${periods[i]}` },
        update: {},
        create: {
          id: `snap_${buId}_${periods[i]}`,
          planId: plans[0].id,
          businessUnitId: buId,
          headcount: hc,
          openReqs: Math.floor(hc * 0.04),
          attrition: 0.07 + Math.random() * 0.04,
          budgetUsed: hc * 175000 * 0.91,
          period: periods[i],
        },
      });
    }
  }

  // Skills Inventory
  const skillsData = [
    { skillName: "Generative AI / Prompt Engineering", category: "AI/ML", currentCount: 42, targetCount: 120, gapScore: 0.65, aiRiskScore: 0.05 },
    { skillName: "Large Language Model Integration", category: "AI/ML", currentCount: 18, targetCount: 85, gapScore: 0.79, aiRiskScore: 0.05 },
    { skillName: "Data Science & Analytics", category: "Data", currentCount: 95, targetCount: 140, gapScore: 0.32, aiRiskScore: 0.35 },
    { skillName: "Enterprise Sales (MEDDIC)", category: "Sales", currentCount: 182, targetCount: 220, gapScore: 0.17, aiRiskScore: 0.22 },
    { skillName: "Salesforce / CRM Administration", category: "RevOps", currentCount: 68, targetCount: 90, gapScore: 0.24, aiRiskScore: 0.50 },
    { skillName: "Customer Success Management", category: "CS", currentCount: 142, targetCount: 180, gapScore: 0.21, aiRiskScore: 0.30 },
    { skillName: "Cloud Architecture (AWS/GCP/Azure)", category: "Engineering", currentCount: 198, targetCount: 240, gapScore: 0.18, aiRiskScore: 0.15 },
    { skillName: "Executive Presentation / Storytelling", category: "Leadership", currentCount: 88, targetCount: 130, gapScore: 0.32, aiRiskScore: 0.08 },
    { skillName: "Financial Planning & Analysis", category: "Finance", currentCount: 55, targetCount: 72, gapScore: 0.24, aiRiskScore: 0.45 },
    { skillName: "Change Management", category: "HR/OD", currentCount: 22, targetCount: 65, gapScore: 0.66, aiRiskScore: 0.12 },
    { skillName: "MLOps / Model Deployment", category: "AI/ML", currentCount: 12, targetCount: 55, gapScore: 0.78, aiRiskScore: 0.10 },
    { skillName: "Agentforce / AI Agent Orchestration", category: "AI/ML", currentCount: 5, targetCount: 60, gapScore: 0.92, aiRiskScore: 0.05 },
  ];

  for (const s of skillsData) {
    await prisma.skillsInventory.upsert({
      where: { id: `skill_${s.skillName.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 40)}` },
      update: {},
      create: {
        id: `skill_${s.skillName.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 40)}`,
        ...s,
        orgId: org.id,
        quarter: "2026-Q1",
      },
    });
  }

  // Attrition scores
  for (let i = 0; i < Math.min(roles.length, 12); i++) {
    const r = roles[i];
    const score = r.attritionRisk;
    const tier = score > 0.8 ? "CRITICAL" : score > 0.6 ? "HIGH" : score > 0.4 ? "ELEVATED" : score > 0.2 ? "MODERATE" : "LOW";
    await prisma.attritionScore.upsert({
      where: { id: `attr_${r.id}` },
      update: {},
      create: {
        id: `attr_${r.id}`,
        roleId: r.id,
        cohortKey: `${r.jobFamily}-${r.gradeLevel}`,
        riskScore: score,
        riskTier: tier as any,
        topDrivers: ["Below market compensation", "Limited promotion velocity", "Manager change in last 6 months"],
      },
    });
  }

  // Sample Plan Review
  await prisma.planReview.upsert({
    where: { id: "review_fy26_q2" },
    update: {},
    create: {
      id: "review_fy26_q2",
      planId: plans[1].id,
      status: "COMPLETED",
      riskFindings: {
        findings: [
          { category: "Hiring Lead Time", severity: "high", description: "Q2 plan assumes 45-day TTF for Engineering L5+ roles; current TTF is 82 days" },
          { category: "Concentration Risk", severity: "medium", description: "68% of Q2 hires target San Francisco — consider distribution risk" },
          { category: "Succession Gap", severity: "medium", description: "VP Engineering role has no identified L-1 successor" },
        ],
        score: 61,
        summary: "Plan has material execution risk in hiring timeline assumptions",
      },
      budgetFindings: {
        findings: [
          { category: "Loaded Cost", severity: "medium", description: "Benefits loading factor at 18% — industry standard for SaaS is 22-25%" },
        ],
        score: 78,
        total_validated_cost: 24_800_000,
        variance_from_approved: -1_200_000,
      },
      benchmarkFindings: {
        findings: [
          { category: "Span of Control", severity: "low", description: "Engineering avg span 7.2 — within benchmark range of 6-9" },
          { category: "Revenue per Employee", severity: "low", description: "$215K RPE vs SaaS median $195K — healthy" },
        ],
        score: 82,
        comparisons: [
          { metric: "Span of Control", plan_value: 7.2, benchmark: 7.5, variance_pct: -4 },
          { metric: "Revenue per Employee", plan_value: 215000, benchmark: 195000, variance_pct: 10.3 },
        ],
      },
      conflicts: { conflicts: [], overall_health: "NEEDS_REFINEMENT" },
      overallScore: 72,
      recommendation: "Approve with modifications: revise hiring lead time assumptions for Engineering to 75 days and increase benefits loading to 23%.",
      completedAt: new Date("2026-04-15"),
    },
  });

  // Function Analysis (Sales Ops blueprint)
  const salesOpsAnalysis = await prisma.functionAnalysis.upsert({
    where: { id: "analysis_sales_ops" },
    update: {},
    create: {
      id: "analysis_sales_ops",
      organizationId: org.id,
      functionName: "Sales Operations",
      businessUnitId: buMap.SALES.id,
      scope: "End-to-end Sales Ops function including forecasting, territory management, CRM hygiene, pipeline reporting, commission calculations, and sales enablement support.",
      status: "COMPLETED",
      aiReadinessScore: 74,
      workflowMap: {
        workflows: [
          { name: "Weekly Forecast Roll-Up", frequency: "weekly", stakeholders: ["AEs", "Sales Managers", "VP Sales"], pain_points: ["Manual CRM data extraction", "Inconsistent deal stage definitions"] },
          { name: "Territory Planning", frequency: "quarterly", stakeholders: ["Sales Ops", "Sales Leaders", "Finance"], pain_points: ["Slow what-if modeling", "No real-time capacity view"] },
          { name: "Commission Calculation & Dispute Resolution", frequency: "monthly", stakeholders: ["Sales Ops", "Finance", "AEs"], pain_points: ["Error-prone spreadsheet process", "High dispute volume"] },
        ],
      },
      taskInventory: [
        { task_name: "CRM data hygiene", weekly_hours_total: 24, complexity: "low", judgment_required: "low" },
        { task_name: "Pipeline report generation", weekly_hours_total: 8, complexity: "low", judgment_required: "low" },
        { task_name: "Forecast synthesis and narrative", weekly_hours_total: 12, complexity: "high", judgment_required: "high" },
        { task_name: "Territory rebalancing analysis", weekly_hours_total: 6, complexity: "medium", judgment_required: "medium" },
        { task_name: "Commission calculation", weekly_hours_total: 16, complexity: "medium", judgment_required: "low" },
        { task_name: "Sales enablement content curation", weekly_hours_total: 10, complexity: "medium", judgment_required: "medium" },
      ],
      productivityBaseline: { data_quality: 72, process_documentation: 45, task_repeatability: 78, judgment_concentration: 55, tooling_maturity: 68 },
      createdBy: users[0].id,
    },
  });

  // Task Augmentations for Sales Ops
  const taskAugmentations = [
    { taskName: "CRM data hygiene", currentOwner: "Revenue Operations Analyst", weeklyHoursTotal: 24, augmentationMode: "DO" as const, rationale: "Highly repeatable, rule-based tasks with low judgment requirement. Agentforce can detect and fix CRM inconsistencies autonomously.", agentforceCapability: "Agentforce Sales Agent", alternativeTools: ["Salesforce Einstein Activity Capture", "Gong"], estimatedHoursSaved: 20, qualityImpact: "IMPROVES" as const, humanJudgmentRequired: false, confidenceScore: 0.91 },
    { taskName: "Pipeline report generation", currentOwner: "Revenue Operations Analyst", weeklyHoursTotal: 8, augmentationMode: "DO" as const, rationale: "Structured data extraction and formatting — zero judgment required. AI can generate and distribute reports on schedule.", agentforceCapability: "Tableau Pulse", alternativeTools: ["Sigma Computing", "Mode Analytics"], estimatedHoursSaved: 7, qualityImpact: "IMPROVES" as const, humanJudgmentRequired: false, confidenceScore: 0.95 },
    { taskName: "Forecast synthesis and narrative", currentOwner: "Sales Manager", weeklyHoursTotal: 12, augmentationMode: "ASSIST" as const, rationale: "Requires experienced judgment on deal risk and pipeline health. AI drafts the narrative; human reviews, adjusts, and owns the call.", agentforceCapability: "Agentforce Sales Coach", alternativeTools: ["Clari", "Gong Forecast"], estimatedHoursSaved: 5, qualityImpact: "IMPROVES" as const, humanJudgmentRequired: true, confidenceScore: 0.82 },
    { taskName: "Commission calculation", currentOwner: "Revenue Operations Analyst", weeklyHoursTotal: 16, augmentationMode: "CHECK" as const, rationale: "Calculation logic is automatable but trust is critical — errors directly impact compensation. AI runs the calculation; human audits edge cases.", agentforceCapability: null, alternativeTools: ["CaptivateIQ", "Spiff", "Xactly"], estimatedHoursSaved: 10, qualityImpact: "REQUIRES_OVERSIGHT" as const, humanJudgmentRequired: true, confidenceScore: 0.78 },
  ];

  for (const ta of taskAugmentations) {
    await prisma.taskAugmentation.upsert({
      where: { id: `ta_salesops_${ta.taskName.replace(/[^a-z0-9]/gi, "_").toLowerCase().slice(0, 30)}` },
      update: {},
      create: {
        id: `ta_salesops_${ta.taskName.replace(/[^a-z0-9]/gi, "_").toLowerCase().slice(0, 30)}`,
        functionAnalysisId: salesOpsAnalysis.id,
        taskDescription: ta.rationale,
        ...ta,
      },
    });
  }

  // Productivity Projection for Sales Ops
  await prisma.productivityProjection.upsert({
    where: { id: "proj_sales_ops" },
    update: {},
    create: {
      id: "proj_sales_ops",
      functionAnalysisId: salesOpsAnalysis.id,
      hoursSavedPerWeek: 42,
      fteEquivalentSaved: 1.05,
      costSavingsAnnualUsd: 820_000,
      revenueLiftAnnualUsd: 2_100_000,
      costPerOutcomeBefore: 4800,
      costPerOutcomeAfter: 2950,
      employeeExperienceScore: 72,
      paybackPeriodMonths: 8,
      threeYearNPV: 5_800_000,
      assumptionsLog: [
        { assumption: "Loaded cost per FTE", value: "$185,000/yr", source: "Finance comp data FY2026" },
        { assumption: "Tool cost (Agentforce + Tableau Pulse)", value: "$42,000/yr", source: "Salesforce enterprise quote" },
        { assumption: "Adoption rate at 12 months", value: "85%", source: "Benchmark: Salesforce customer data" },
      ],
      sensitivityAnalysis: {
        best_case_npv: 8_200_000,
        expected_npv: 5_800_000,
        worst_case_npv: 2_400_000,
        key_drivers: ["Adoption rate", "AE productivity lift", "CRM data quality improvement"],
      },
    },
  });

  // Anti-patterns for Sales Ops
  await prisma.antiPattern.upsert({
    where: { id: "ap_salesops_rubber" },
    update: {},
    create: {
      id: "ap_salesops_rubber",
      functionAnalysisId: salesOpsAnalysis.id,
      patternType: "RUBBER_STAMP",
      severity: "CAUTION",
      description: "If commission calculation CHECK step is not genuinely audited each cycle, humans will default to approving AI output without real review — eliminating accountability.",
      affectedTasks: ["Commission calculation"],
      mitigation: "Implement mandatory anomaly review: AI flags cases exceeding ±5% variance for mandatory human review. Track dispute rate monthly — rising disputes signal rubber-stamping.",
    },
  });

  // Market signals
  await prisma.marketSignal.upsert({
    where: { id: "ms_ml_sf" },
    update: {},
    create: {
      id: "ms_ml_sf",
      signalType: "TALENT_SUPPLY",
      jobFamily: "ML Engineer",
      location: "San Francisco",
      data: { demand_index: 1.42, supply_index: 0.78, ratio: 1.82 },
      summary: "## Talent Supply\nML Engineer talent pool in SF is severely constrained. Demand outpacing supply by 1.8x as of Q1 2026.\n## Salary Benchmarks\nP50: $220K, P75: $260K, P90: $310K for senior ML Engineers.\n## Risk Signals\nMeta, Google, and Anthropic all actively expanding ML hiring in SF — expect extended time-to-fill (90-120 days).",
      sources: ["https://levels.fyi", "https://bls.gov", "https://linkedin.com/talent-insights"],
    },
  });

  // Agent runs (activity feed)
  await prisma.agentRun.upsert({
    where: { id: "run_attrition_batch_1" },
    update: {},
    create: {
      id: "run_attrition_batch_1",
      agentType: "ATTRITION_PREDICTOR",
      status: "COMPLETED",
      input: { type: "batch", cohorts: 847 },
      output: { scored: 847, high_risk: 23, critical: 4 },
      tokensUsed: 128000,
      costUsd: 1.92,
      durationMs: 45200,
      organizationId: org.id,
      triggeredBy: "system",
      completedAt: new Date(Date.now() - 6 * 3600000),
    },
  });

  await prisma.agentRun.upsert({
    where: { id: "run_collab_salesops" },
    update: {},
    create: {
      id: "run_collab_salesops",
      agentType: "COLLABORATION_ADVISOR",
      status: "COMPLETED",
      input: { functionName: "Sales Operations", scope: "Full function analysis" },
      output: { analysisId: salesOpsAnalysis.id, hoursSaved: 42, npv: 5800000 },
      tokensUsed: 78000,
      costUsd: 1.17,
      durationMs: 38900,
      organizationId: org.id,
      triggeredBy: users[0].id,
      completedAt: new Date(Date.now() - 2 * 3600000),
    },
  });

  console.log("✅ Seed complete — Acme Corp (2,400 employees) ready");
  console.log(`   Org: ${org.id}`);
  console.log(`   BUs: ${bus.length}`);
  console.log(`   Roles: ${roles.length}`);
  console.log(`   Plans: ${plans.length}`);
  console.log(`   Skills: ${skillsData.length}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
