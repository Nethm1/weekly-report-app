require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Report = require('./models/Report');
const Project = require('./models/Project');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  let manager;
  // Clear old reports and projects
  await Report.deleteMany({});
  await Project.deleteMany({});
  console.log('Cleared old reports and projects');

  // Delete ALL old users and start fresh
  await User.deleteMany({});
  console.log('Cleared all old user accounts');

  // Create proper Sri Lankan manager
  manager = await User.create({
    name: 'Nethmi Wasana',
    email: 'nethmi@techwave.lk',
    password: 'password123',
    role: 'manager',
    department: 'Product Management',
  });
  console.log('Created manager:', manager.name);

  // Sri Lankan IT company projects - English only
  const projectList = [
    { name: 'eLanka Portal', color: '#7C3AED', description: 'Government digital services portal for Sri Lanka' },
    { name: 'SriPay Gateway', color: '#06b6d4', description: 'Local payment integration - BOC, Sampath, HNB' },
    { name: 'CeylonMart Mobile', color: '#10b981', description: 'E-commerce mobile app for Sri Lankan market' },
    { name: 'Colombo Smart City', color: '#f59e0b', description: 'IoT dashboard for Colombo smart infrastructure' },
    { name: 'LankaEdu Platform', color: '#ec4899', description: 'Online learning platform for local universities' },
  ];

  const projects = [];
  for (const p of projectList) {
    const proj = await Project.create({ ...p, createdBy: manager._id, isActive: true });
    projects.push(proj);
    console.log('Created project:', p.name);
  }

  // Sri Lankan team members
  const memberList = [
    { name: 'Kavindu Perera', email: 'kavindu@techwave.lk', department: 'Frontend Development' },
    { name: 'Sachini Rajapaksa', email: 'sachini@techwave.lk', department: 'UI/UX Design' },
    { name: 'Dilshan Fernando', email: 'dilshan@techwave.lk', department: 'Backend Development' },
    { name: 'Tharushi Senanayake', email: 'tharushi@techwave.lk', department: 'QA & Testing' },
    { name: 'Rusiru Wickramasinghe', email: 'rusiru@techwave.lk', department: 'DevOps & Cloud' },
  ];

  const members = [];
  for (const m of memberList) {
    const user = await User.create({ ...m, password: 'password123', role: 'member' });
    members.push(user);
    console.log('Created user:', m.name);
  }

  // Report templates - pure English, Sri Lankan IT context
  const reportTemplates = [
    // Kavindu - Frontend Dev - eLanka Portal
    [
      {
        tasks: '- Completed responsive layout for eLanka Portal citizen login page\n- Integrated React components with backend REST API endpoints\n- Fixed 4 cross-browser compatibility bugs reported by QA team\n- Participated in sprint review and updated Jira board tickets',
        planned: '- Implement dashboard analytics charts using Recharts library\n- Complete mobile responsive design for tablet breakpoints\n- Write unit tests for authentication components using Jest',
        blockers: 'None',
        hours: 42,
        notes: 'PR #112 merged - eLanka Portal login flow complete',
      },
      {
        tasks: '- Built reusable form component library for eLanka Portal\n- Implemented multi-language support toggle for Sinhala, Tamil, English\n- Optimized bundle size and reduced load time by 35%\n- Completed code review for 3 junior developer pull requests',
        planned: '- Complete notifications module frontend\n- Performance audit and Lighthouse score improvements\n- Update Storybook component documentation',
        blockers: 'Waiting for backend team - user profile API endpoint not ready yet',
        hours: 40,
        notes: '',
      },
      {
        tasks: '- Migrated 6 legacy jQuery modules to React functional components\n- Implemented lazy loading for dashboard pages to improve performance\n- Fixed 6 critical UI bugs reported by QA and client demo feedback\n- Attended client presentation at Dialog Axiata HQ, Colombo 03',
        planned: '- Start eLanka Portal mobile app integration\n- Accessibility audit against WCAG 2.1 standards\n- Storybook documentation update',
        blockers: 'None',
        hours: 43,
        notes: '',
      },
      {
        tasks: '- Delivered eLanka Portal Phase 1 frontend on schedule\n- Configured Webpack production build with code splitting\n- Created onboarding tutorial UI flow for new citizens\n- Cleared 8 backlog tickets from sprint board',
        planned: '- Begin CeylonMart mobile frontend development\n- Setup Jest and React Testing Library environment\n- Prepare technical handover documentation',
        blockers: 'None',
        hours: 41,
        notes: 'Phase 1 delivered on schedule - client approved',
      },
    ],
    // Sachini - UI/UX Design - CeylonMart Mobile
    [
      {
        tasks: '- Redesigned CeylonMart mobile app UI for local Sri Lankan market preferences\n- Created high-fidelity Figma prototypes for 12 new screens\n- Conducted user testing session with 8 participants across Colombo\n- Updated design system with local brand colors and typography',
        planned: '- Finalize UI mockups for client presentation at MAS Holdings\n- Design app store screenshots and marketing banner assets\n- Create icon set with Sri Lankan cultural visual references',
        blockers: 'Client logo approval still pending from their marketing team',
        hours: 38,
        notes: 'User testing report shared with product and dev teams',
      },
      {
        tasks: '- Completed high-fidelity prototypes for Colombo Smart City dashboard\n- Designed data visualization components for traffic and energy modules\n- Presented design concepts to CMC (Colombo Municipal Council) stakeholders\n- Incorporated 3 rounds of stakeholder feedback into final designs',
        planned: '- Design dark mode variants for all dashboard screens\n- Improve color contrast ratios for accessibility compliance\n- Create motion design and micro-interaction guidelines',
        blockers: 'None',
        hours: 36,
        notes: '',
      },
      {
        tasks: '- Created LankaEdu Platform brand identity and visual design system\n- Designed course listing, video player, and quiz UI components\n- Conducted competitive analysis of Coursera and local e-learning apps\n- Delivered final design specs to frontend development team',
        planned: '- Design LankaEdu mobile app screens\n- Create instructor dashboard wireframes\n- Complete design handoff documentation in Zeplin',
        blockers: 'Need content samples and course images from University of Colombo',
        hours: 39,
        notes: '',
      },
      {
        tasks: '- Completed SriPay Gateway checkout flow redesign\n- Designed transaction history, receipt, and confirmation screens\n- Ran usability testing sessions with BOC and Sampath Bank UX teams\n- Created animated micro-interaction prototypes in Principle app',
        planned: '- Finalize SriPay visual brand guidelines document\n- Design error states and empty state illustrations\n- Prepare comprehensive design system documentation',
        blockers: 'None',
        hours: 37,
        notes: 'Usability score improved from 62 to 84 after redesign',
      },
    ],
    // Dilshan - Backend Dev - SriPay Gateway
    [
      {
        tasks: '- Developed SriPay payment gateway API with BOC and Sampath Bank integration\n- Implemented PCI-DSS compliant AES-256 encryption for card data storage\n- Optimized slow database queries - API response time reduced by 40%\n- Patched 2 security vulnerabilities found in OWASP audit report',
        planned: '- Implement real-time payment webhook notification system\n- Run load testing with 10,000 concurrent user simulation\n- Complete full API documentation on Postman and Swagger',
        blockers: 'Sampath Bank sandbox API credentials delayed - waiting for their team',
        hours: 45,
        notes: 'Security audit report submitted to compliance team',
      },
      {
        tasks: '- Built eLanka Portal backend services using Node.js, Express, and MongoDB\n- Integrated with Sri Lanka ICTA NIC verification and validation API\n- Implemented JWT-based authentication with role-based access control\n- Deployed production environment on AWS Singapore with auto-scaling groups',
        planned: '- Add Redis caching layer for frequent government data lookups\n- Build PDF generation service for citizen certificates and documents\n- Implement rate limiting and DDoS protection middleware',
        blockers: 'None',
        hours: 47,
        notes: 'Full API documentation published at api.elanka.lk/docs',
      },
      {
        tasks: '- Developed Colombo Smart City IoT data ingestion and processing pipeline\n- Successfully integrated with 45 traffic sensor APIs deployed across Colombo\n- Built real-time WebSocket server for live dashboard data updates\n- Created MongoDB aggregation pipelines for hourly and daily analytics reports',
        planned: '- Build predictive traffic analytics module using historical data\n- Connect data export pipeline to ICTA government systems\n- Run performance benchmarking under peak load conditions',
        blockers: 'Several sensor API endpoints returning inconsistent data formats',
        hours: 44,
        notes: '',
      },
      {
        tasks: '- Deployed LankaEdu video content delivery on AWS CloudFront CDN\n- Implemented full-text Sinhala and Tamil search using Elasticsearch\n- Built automated quiz grading and score calculation engine\n- Integrated with University of Colombo student management API',
        planned: '- Implement live virtual classroom streaming using WebRTC\n- Build automated certificate generation and email delivery\n- Add payment gateway for premium course subscriptions',
        blockers: 'None',
        hours: 46,
        notes: 'Platform load tested successfully with 5000 concurrent students',
      },
    ],
    // Tharushi - QA - LankaEdu Platform
    [
      {
        tasks: '- Completed full regression test suite for LankaEdu Platform v2.1 release\n- Logged 12 defects in Jira: 4 critical, 5 major, 3 minor severity\n- Wrote 8 Selenium automation scripts covering login and enrollment workflows\n- Performed performance testing simulating Dialog and SLT network conditions',
        planned: '- Execute mobile app testing on Android and iOS physical devices\n- Run cross-browser compatibility matrix testing\n- Write final test summary report for UAT stakeholder sign-off',
        blockers: 'None',
        hours: 40,
        notes: 'Test coverage increased from 67% to 82% this sprint',
      },
      {
        tasks: '- Completed API functional testing for all 34 SriPay payment scenarios\n- Performed security penetration testing using OWASP ZAP scanner\n- Validated edge cases including failed transactions and timeout handling\n- Coordinated UAT sessions with BOC and HNB bank testing teams',
        planned: '- Automate full regression test suite for payment flows\n- Prepare UAT acceptance criteria documentation for banks\n- Test payment retry and idempotency key handling',
        blockers: 'QA test environment was down for 2 days - DevOps resolved the issue',
        hours: 38,
        notes: 'All 34 critical payment test cases passed successfully',
      },
      {
        tasks: '- Completed eLanka Portal end-to-end testing across 5 major browsers\n- Verified Sinhala and Tamil text rendering and character encoding\n- Tested site performance on slow 3G connections simulating rural Sri Lanka\n- Documented 7 accessibility issues for WCAG 2.1 AA compliance review',
        planned: '- Execute final smoke test suite before production go-live\n- Coordinate load testing with 50,000 simulated citizen users\n- Complete production deployment go-live readiness checklist',
        blockers: 'None',
        hours: 41,
        notes: 'Achieved 98.5% overall test pass rate - ready for go-live',
      },
      {
        tasks: '- Tested Colombo Smart City dashboard across desktop, laptop, and tablet\n- Validated real-time traffic data accuracy from all 45 sensor APIs\n- Performed WebSocket connection stability testing under load\n- Configured Datadog automated monitoring alerts and dashboards',
        planned: '- Complete mobile responsiveness testing on phones\n- Validate chart data accuracy against raw sensor data\n- Prepare CMC stakeholder demo sign-off documentation',
        blockers: 'Flagged sensor data inconsistencies to backend team for investigation',
        hours: 39,
        notes: '',
      },
    ],
    // Rusiru - DevOps - Colombo Smart City
    [
      {
        tasks: '- Provisioned complete AWS infrastructure for Colombo Smart City project\n- Configured CI/CD pipeline using GitHub Actions and AWS CodeDeploy\n- Reduced Docker image sizes by 60% through multi-stage build optimization\n- Set up Grafana and Prometheus monitoring with custom alert rules',
        planned: '- Deploy Kubernetes cluster on Amazon EKS for container orchestration\n- Implement disaster recovery and automated daily backup procedures\n- Review and reduce monthly AWS infrastructure costs by 20%',
        blockers: 'AWS direct Sri Lanka region unavailable - using Singapore ap-southeast-1',
        hours: 44,
        notes: 'Infrastructure optimization saved LKR 45,000 per month',
      },
      {
        tasks: '- Deployed eLanka Portal to AWS production with zero-downtime blue-green deployment\n- Configured AWS CloudFront CDN with 3 Sri Lanka edge locations\n- Set up auto-scaling policies for peak traffic during government deadlines\n- Provisioned SSL/TLS certificates and AWS WAF security rules',
        planned: '- Configure multi-region active-passive failover setup\n- Implement automated RDS database replication and point-in-time recovery\n- Complete infrastructure security hardening review checklist',
        blockers: 'None',
        hours: 43,
        notes: 'System maintained 99.9% uptime throughout the deployment week',
      },
      {
        tasks: '- Migrated SriPay staging environment to dedicated PCI-DSS AWS account\n- Implemented network segmentation with private VPC subnets for payment services\n- Deployed automated vulnerability scanning using AWS Inspector and Security Hub\n- Configured CloudTrail audit logging for PCI-DSS compliance requirements',
        planned: '- Execute production migration with documented rollback procedures\n- Complete network architecture review with security team\n- Prepare evidence package for PCI-DSS Level 1 certification audit',
        blockers: 'PCI-DSS certification process timeline extended by 2 weeks',
        hours: 46,
        notes: 'AWS security compliance score improved to 94 out of 100',
      },
      {
        tasks: '- Deployed LankaEdu video CDN with 5 AWS edge locations across Sri Lanka\n- Optimized media delivery for Dialog Axiata and SLT-Mobitel network paths\n- Implemented automated S3 lifecycle policies for course content backup\n- Reduced average page load time from 4.2 seconds to 1.8 seconds',
        planned: '- Scale infrastructure ahead of university exam season traffic surge\n- Build cost monitoring and budget alert dashboards\n- Evaluate migration to ARM-based Graviton instances for cost savings',
        blockers: 'None',
        hours: 42,
        notes: 'CDN switch saves LKR 120,000 per month vs previous provider',
      },
    ],
  ];

  // Create 8 weeks of reports with VARIED counts for realistic trend chart
  const now = new Date();
  // Week counts vary: 2, 3, 4, 5, 3, 4, 5, 5 (realistic trend)
  const weekMemberCounts = [2, 3, 4, 5, 3, 4, 5, 5];

  for (let week = 0; week < 8; week++) {
    const dayOfWeek = now.getDay();
    const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + diffToMonday - (week * 7));
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const count = weekMemberCounts[week] || members.length;
    const membersThisWeek = members.slice(0, count);

    for (let i = 0; i < membersThisWeek.length; i++) {
      const template = reportTemplates[i % reportTemplates.length][week % 4] || reportTemplates[i % reportTemplates.length][0];
      const submitDate = new Date(weekStart);
      submitDate.setDate(weekStart.getDate() + 4);

      await Report.create({
        user: membersThisWeek[i]._id,
        project: projects[i % projects.length]._id,
        weekStart,
        weekEnd,
        tasksCompleted: template.tasks,
        tasksPlanned: template.planned,
        blockers: template.blockers,
        hoursWorked: template.hours + Math.floor(Math.random() * 6) - 2,
        notes: template.notes,
        status: 'submitted',
        submittedAt: week === 0 ? new Date() : submitDate,
      });
    }
    console.log(`Week -${week}: ${count} reports created`);
  }

  console.log('\n========================================');
  console.log('  Seed Complete - TechWave Solutions');
  console.log('  No. 42, Galle Road, Colombo 03');
  console.log('========================================');
  console.log('Manager:  nethmi@techwave.lk  /  password123');
  console.log('Members:  kavindu / sachini / dilshan / tharushi / rusiru @techwave.lk');
  console.log('Password: password123 (all accounts)');
  console.log('========================================\n');
  process.exit(0);
};

seed().catch(e => { console.error('Error:', e.message); process.exit(1); });
