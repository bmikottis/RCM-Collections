/**
 * Sample hierarchical collection data for the Collection Hierarchy View prototype.
 * Life Sciences industry focused - regulatory content management.
 */

import { getMakanaHealthCollection } from './makanaHealthData.js';
import { getCordimCollection } from './cordimData.js';

// Collection Types/Templates – life sciences (FDA, EMA, drug launch, etc.)
export const collectionTypes = [
    {
        id: 'ct-001',
        name: 'FDA NDA/BLA Submission',
        icon: 'standard:approval',
        description: 'FDA New Drug Application or Biologics License Application. Full CTD-style grouping for launching a new drug: Modules 1–5, administrative, quality, nonclinical, clinical.',
        structureModifiable: false,
        namingStructure: 'Use format: Module [number] - [Section name] (e.g. Module 1, Module 2). Required for CTD alignment.',
        namingExample: 'e.g. Module 1 - Administrative Documents',
        requiredContent: [
            { id: 'req-001', name: 'Submission Cover Letter', contentType: 'pdf', description: 'Official cover letter for FDA submission' },
            { id: 'req-002', name: 'Product Summary', contentType: 'word', description: 'Executive summary of the product' },
            { id: 'req-003', name: 'Module 1 Administrative Documents', contentType: 'pdf', description: 'Regional administrative information' },
            { id: 'req-004', name: 'Module 2 CTD Summaries', contentType: 'pdf', description: 'Quality, nonclinical, and clinical summaries' },
            { id: 'req-005', name: 'Module 3 Quality Documentation', contentType: 'pdf', description: 'CMC documentation' },
            { id: 'req-006', name: 'Environmental Assessment', contentType: 'pdf', description: 'Environmental impact assessment' }
        ],
        requiredTasks: [
            { id: 'task-001', name: 'Quality review of all documents', category: 'Review' },
            { id: 'task-002', name: 'Regulatory affairs sign-off', category: 'Approval' },
            { id: 'task-003', name: 'Legal/IP review completed', category: 'Review' },
            { id: 'task-004', name: 'Cross-functional alignment meeting', category: 'Meeting' }
        ],
        defaultChildCollections: [
            { name: 'Module 1 Administrative Documents' },
            { name: 'Module 2 CTD Summaries' },
            { name: 'Module 3 Quality Documentation' }
        ],
        defaultMembers: [
            { name: 'Regulatory Affairs', role: 'Owner' },
            { name: 'Medical Writing', role: 'Editor' }
        ]
    },
    {
        id: 'ct-002',
        name: 'FDA Labeling (PI & Medication Guide)',
        icon: 'standard:document',
        description: 'Prescribing Information, Highlights, Patient Package Insert, and FDA-required Medication Guide for drug launch and updates.',
        structureModifiable: false,
        namingStructure: 'Name sections per FDA labeling: Full PI, Highlights, PPI, or Medication Guide.',
        namingExample: 'e.g. Full Prescribing Information',
        requiredContent: [
            { id: 'req-010', name: 'Full Prescribing Information', contentType: 'pdf', description: 'Complete prescribing information document' },
            { id: 'req-011', name: 'Highlights Section', contentType: 'pdf', description: 'Key safety and efficacy highlights' },
            { id: 'req-012', name: 'Patient Package Insert', contentType: 'pdf', description: 'Patient-facing information leaflet' },
            { id: 'req-013', name: 'Medication Guide', contentType: 'pdf', description: 'FDA-required medication guide' }
        ],
        requiredTasks: [
            { id: 'task-010', name: 'Medical/Legal/Regulatory review', category: 'Review' },
            { id: 'task-011', name: 'Label reconciliation complete', category: 'Verification' }
        ],
        defaultChildCollections: [
            { name: 'Full Prescribing Information' },
            { name: 'Highlights Section' },
            { name: 'Patient Package Insert' },
            { name: 'Medication Guide' }
        ],
        defaultMembers: [
            { name: 'Medical/Legal/Regulatory', role: 'Owner' }
        ]
    },
    {
        id: 'ct-003',
        name: 'Clinical Trial Documentation',
        icon: 'standard:record',
        description: 'Protocols, ICFs, CRFs, and clinical study documentation with approval workflows for trials.',
        structureModifiable: false,
        requiredContent: [
            { id: 'req-020', name: 'Clinical Study Protocol', contentType: 'pdf', description: 'Approved study protocol' },
            { id: 'req-021', name: 'Investigator Brochure', contentType: 'pdf', description: 'Current investigator brochure' },
            { id: 'req-022', name: 'Informed Consent Form', contentType: 'pdf', description: 'IRB-approved ICF' },
            { id: 'req-023', name: 'Case Report Form', contentType: 'pdf', description: 'CRF completion guidelines' },
            { id: 'req-024', name: 'Statistical Analysis Plan', contentType: 'pdf', description: 'Pre-specified SAP' }
        ],
        requiredTasks: [
            { id: 'task-020', name: 'IRB/Ethics approval obtained', category: 'Approval' },
            { id: 'task-021', name: 'Site initiation completed', category: 'Milestone' },
            { id: 'task-022', name: 'Data Management Plan finalized', category: 'Planning' }
        ],
        requiredApprovals: [
            { id: 'approval-001', name: 'Clinical Lead Approval', approver: 'Dr. Sarah Johnson' },
            { id: 'approval-002', name: 'Regulatory Affairs Approval', approver: 'Mike Chen' },
            { id: 'approval-003', name: 'Quality Assurance Sign-off', approver: 'Emily Davis' }
        ],
        defaultChildCollections: [
            { name: 'Informed Consent Forms' },
            { name: 'Case Report Forms' }
        ],
        defaultMembers: [
            { name: 'Clinical Operations', role: 'Owner' },
            { name: 'Data Management', role: 'Editor' }
        ]
    },
    {
        id: 'ct-004',
        name: 'Safety & Risk (REMS / RMP)',
        icon: 'standard:case',
        description: 'US REMS and/or EU Risk Management Plan, safety management plans, and periodic safety reports.',
        structureModifiable: true,
        requiredContent: [
            { id: 'req-030', name: 'Safety Management Plan', contentType: 'pdf', description: 'Comprehensive safety monitoring plan' },
            { id: 'req-031', name: 'Risk Management Plan', contentType: 'pdf', description: 'EU RMP or US REMS' },
            { id: 'req-032', name: 'PSUR/PBRER Template', contentType: 'pdf', description: 'Periodic safety report template' }
        ],
        requiredTasks: [
            { id: 'task-030', name: 'Safety database reconciliation', category: 'Verification' },
            { id: 'task-031', name: 'Signal detection review', category: 'Review' }
        ],
        defaultChildCollections: [
            { name: 'Safety Management Plan' },
            { name: 'Periodic Safety Reports' }
        ],
        defaultMembers: [
            { name: 'Drug Safety', role: 'Owner' }
        ]
    },
    {
        id: 'ct-005',
        name: 'FDA ANDA (Generic Drug)',
        icon: 'standard:document',
        description: 'Abbreviated New Drug Application for generic drugs. Required content and structure for FDA generic submissions.',
        structureModifiable: false,
        requiredContent: [
            { id: 'req-040', name: 'ANDA Cover Letter', contentType: 'pdf', description: 'Cover letter and application form' },
            { id: 'req-041', name: 'Labeling (Draft)', contentType: 'pdf', description: 'Proposed labeling' },
            { id: 'req-042', name: 'Bioequivalence Study Reports', contentType: 'pdf', description: 'BE data and analysis' },
            { id: 'req-043', name: 'CMC Section', contentType: 'pdf', description: 'Chemistry, manufacturing, and controls' }
        ],
        requiredTasks: [
            { id: 'task-040', name: 'Bioequivalence review', category: 'Review' },
            { id: 'task-041', name: 'Regulatory submission ready', category: 'Approval' }
        ],
        defaultChildCollections: [
            { name: 'ANDA Cover Letter & Forms' },
            { name: 'Labeling (Draft)' },
            { name: 'Bioequivalence Studies' },
            { name: 'CMC Section' }
        ]
    },
    {
        id: 'ct-006',
        name: 'EMA CTD Submission',
        icon: 'standard:approval',
        description: 'EMA Common Technical Document structure for EU centralized and national procedures (Modules 1–5).',
        structureModifiable: false,
        namingStructure: 'Use CTD module naming: Module 1 (Regional), Module 2 Summaries, Module 3 Quality, Module 4 Nonclinical, Module 5 Clinical.',
        namingExample: 'e.g. Module 1 (Regional)',
        requiredContent: [
            { id: 'req-050', name: 'Module 1 (Regional)', contentType: 'pdf', description: 'EMA-specific administrative and regional information' },
            { id: 'req-051', name: 'Module 2 Summaries', contentType: 'pdf', description: 'Quality, nonclinical, clinical summaries' },
            { id: 'req-052', name: 'Module 3 Quality', contentType: 'pdf', description: 'CMC and quality' },
            { id: 'req-053', name: 'Module 4 Nonclinical', contentType: 'pdf', description: 'Nonclinical study reports' },
            { id: 'req-054', name: 'Module 5 Clinical', contentType: 'pdf', description: 'Clinical study reports' }
        ],
        requiredTasks: [
            { id: 'task-050', name: 'QRD review', category: 'Review' },
            { id: 'task-051', name: 'EMA validation', category: 'Approval' }
        ],
        defaultChildCollections: [
            { name: 'Module 1 (Regional)' },
            { name: 'Module 2 Summaries' },
            { name: 'Module 3 Quality' },
            { name: 'Module 4 Nonclinical' },
            { name: 'Module 5 Clinical' }
        ],
        defaultMembers: [
            { name: 'Regulatory Affairs', role: 'Owner' }
        ]
    },
    {
        id: 'ct-007',
        name: 'Drug Launch Content Package',
        icon: 'standard:folder',
        description: 'Master grouping of all content needed for a new drug launch: labeling, submissions, safety, and launch materials.',
        structureModifiable: true,
        requiredContent: [
            { id: 'req-060', name: 'Launch Content Index', contentType: 'word', description: 'Master list of all launch content' },
            { id: 'req-061', name: 'Core Labeling Set', contentType: 'pdf', description: 'PI, MG, PPI for initial launch' },
            { id: 'req-062', name: 'Submission Summary', contentType: 'pdf', description: 'Summary of key submissions (NDA/BLA, supplements)' }
        ],
        requiredTasks: [
            { id: 'task-060', name: 'Launch readiness review', category: 'Review' },
            { id: 'task-061', name: 'Content finalization sign-off', category: 'Approval' }
        ],
        defaultChildCollections: [
            { name: 'Launch Content Index' },
            { name: 'Core Labeling Set' },
            { name: 'Submission Summary' }
        ],
        defaultMembers: [
            { name: 'Launch Lead', role: 'Owner' }
        ]
    },
    {
        id: 'ct-008',
        name: 'Internal Guidelines & SOPs',
        icon: 'standard:knowledge',
        description: 'Company guidelines, SOPs, and working templates. Structure can be edited to match your organization.',
        structureModifiable: true,
        requiredContent: [],
        requiredTasks: []
    }
];

// Sample hierarchical collection data (4 levels)
export const sampleCollections = {
    id: 'root',
    name: 'All Collections',
    typeId: null,
    parentId: null,
    level: 0,
    isRoot: true,
    children: [
        getMakanaHealthCollection(),
        getCordimCollection(),
        {
            id: 'col-001',
            name: 'Cardiolex 50mg Regulatory Package',
            typeId: 'ct-001',
            parentId: 'root',
            level: 1,
            isFromTemplate: true,
            metadata: {
                owner: 'Regulatory Affairs',
                region: 'Global',
                status: 'In Progress'
            },
            content: [
                {
                    id: 'cnt-immunexis-demo',
                    name: 'Immunexis Promotional Email.pdf',
                    title: 'Promotional emailer to KOL for Immunexis',
                    contentType: 'pdf',
                    contentTypeLabel: 'Promotional Emailer',
                    version: '0.1',
                    status: 'In Review',
                    effectiveDates: '01/01/2016 - 12/31/2036',
                    fulfillsRequirement: 'req-001',
                    thumbnailUrl: '/public/assets/cordim/02_Risks and prevalence/01_thumbnail.jpg'
                },
                {
                    id: 'cnt-001',
                    name: 'Submission Cover Letter.pdf',
                    contentType: 'pdf',
                    fulfillsRequirement: 'req-001',
                    status: 'Approved',
                    thumbnailUrl: '/public/assets/cordim/01_Patients with arterial hypertension/01_thumbnail.jpg'
                },
                { id: 'cnt-002', name: 'Product Summary.docx', contentType: 'word', fulfillsRequirement: 'req-002', status: 'Draft' },
                { id: 'cnt-002b', name: 'Module 2 CTD Summaries.pdf', contentType: 'pdf', fulfillsRequirement: 'req-004', status: 'Draft' }
            ],
            completedTasks: ['task-004'],
            children: [
                {
                    id: 'col-001-001',
                    name: 'Prescribing Information',
                    typeId: 'ct-002',
                    parentId: 'col-001',
                    level: 2,
                    isFromTemplate: true,
                    metadata: {
                        owner: 'Medical Writing',
                        region: 'Global',
                        status: 'Under Review'
                    },
                    content: [
                        { id: 'cnt-003', name: 'Full Prescribing Information.pdf', contentType: 'pdf', fulfillsRequirement: 'req-010' },
                        { id: 'cnt-004', name: 'Highlights of PI.pdf', contentType: 'pdf', fulfillsRequirement: 'req-011' },
                        { id: 'cnt-005', name: 'Dosage and Administration.docx', contentType: 'word' }
                    ],
                    completedTasks: ['task-010'],
                    children: [
                        {
                            id: 'col-001-001-001',
                            name: 'Localized Versions',
                            typeId: 'ct-002',
                            parentId: 'col-001-001',
                            level: 3,
                            isFromTemplate: true,
                            metadata: {
                                owner: 'Translation Team',
                                region: 'EMEA',
                                status: 'In Progress'
                            },
                            content: [
                                { id: 'cnt-006', name: 'PI_German_DE.pdf', contentType: 'pdf', fulfillsRequirement: 'req-010' },
                                { id: 'cnt-007', name: 'PI_French_FR.pdf', contentType: 'pdf', fulfillsRequirement: 'req-011' },
                                { id: 'cnt-008', name: 'PI_Spanish_ES.pdf', contentType: 'pdf', fulfillsRequirement: 'req-012' }
                            ],
                            completedTasks: ['task-010'],
                            children: [
                                {
                                    id: 'col-001-001-001-001',
                                    name: 'Germany (BfArM)',
                                    typeId: 'ct-002',
                                    parentId: 'col-001-001-001',
                                    level: 4,
                                    isFromTemplate: true,
                                    metadata: {
                                        owner: 'EU Regulatory',
                                        region: 'Germany',
                                        status: 'Approved'
                                    },
                                    content: [
                                        { id: 'cnt-009', name: 'DE_SmPC_Final_Approved.pdf', contentType: 'pdf', fulfillsRequirement: 'req-010' }
                                    ],
                                    completedTasks: ['task-010', 'task-011'],
                                    children: []
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 'col-001-002',
                    name: 'Patient Information Leaflet',
                    typeId: 'ct-002',
                    parentId: 'col-001',
                    level: 2,
                    isFromTemplate: true,
                    metadata: {
                        owner: 'Medical Writing',
                        region: 'Global',
                        status: 'Draft'
                    },
                    content: [
                        { id: 'cnt-010', name: 'Patient Leaflet Master.pdf', contentType: 'pdf', fulfillsRequirement: 'req-012' },
                        { id: 'cnt-011', name: 'Patient Instructions.docx', contentType: 'word' },
                        { id: 'cnt-012', name: 'Medication Guide.pdf', contentType: 'pdf', fulfillsRequirement: 'req-013' }
                    ],
                    completedTasks: [],
                    children: []
                }
            ]
        },
        {
            id: 'col-002',
            name: 'Phase III Clinical Trial - CARD-301',
            typeId: 'ct-003',
            parentId: 'root',
            level: 1,
            isFromTemplate: true,
            isLocked: true,
            workflowStage: 'archive',
            metadata: {
                owner: 'Clinical Operations',
                region: 'Global',
                status: 'Approved'
            },
            content: [
                { id: 'cnt-013', name: 'Clinical Study Protocol.pdf', contentType: 'pdf', fulfillsRequirement: 'req-020' },
                { id: 'cnt-013b', name: 'Investigator Brochure.pdf', contentType: 'pdf', fulfillsRequirement: 'req-021' },
                { id: 'cnt-013c', name: 'Informed Consent Form.pdf', contentType: 'pdf', fulfillsRequirement: 'req-022' },
                { id: 'cnt-013d', name: 'Case Report Form.pdf', contentType: 'pdf', fulfillsRequirement: 'req-023' },
                { id: 'cnt-013e', name: 'Statistical Analysis Plan.pdf', contentType: 'pdf', fulfillsRequirement: 'req-024' }
            ],
            completedTasks: ['task-020', 'task-021', 'task-022'],
            completedApprovals: ['approval-001', 'approval-002', 'approval-003'],
            children: [
                {
                    id: 'col-002-001',
                    name: 'Informed Consent Forms',
                    typeId: 'ct-003',
                    parentId: 'col-002',
                    level: 2,
                    isFromTemplate: true,
                    isLocked: true,
                    metadata: {
                        owner: 'Clinical Operations',
                        region: 'Global',
                        status: 'Approved'
                    },
                    content: [
                        { id: 'cnt-014a', name: 'Protocol Summary.pdf', contentType: 'pdf', fulfillsRequirement: 'req-020' },
                        { id: 'cnt-014b', name: 'IB Excerpt.pdf', contentType: 'pdf', fulfillsRequirement: 'req-021' },
                        { id: 'cnt-014', name: 'ICF Master Template.pdf', contentType: 'pdf', fulfillsRequirement: 'req-022' },
                        { id: 'cnt-014c', name: 'CRF Reference.pdf', contentType: 'pdf', fulfillsRequirement: 'req-023' },
                        { id: 'cnt-014d', name: 'SAP Summary.pdf', contentType: 'pdf', fulfillsRequirement: 'req-024' },
                        { id: 'cnt-015', name: 'ICF Amendment 1.pdf', contentType: 'pdf' },
                        { id: 'cnt-016', name: 'IRB Approval Letter.pdf', contentType: 'pdf' }
                    ],
                    completedTasks: ['task-020', 'task-021', 'task-022'],
                    completedApprovals: ['approval-001', 'approval-002', 'approval-003'],
                    children: [
                        {
                            id: 'col-002-001-001',
                            name: 'Site-Specific ICFs',
                            typeId: 'ct-003',
                            parentId: 'col-002-001',
                            level: 3,
                            isFromTemplate: true,
                            isLocked: true,
                            metadata: {
                                owner: 'Site Management',
                                region: 'US',
                                status: 'Approved'
                            },
                            content: [
                                { id: 'cnt-017', name: 'ICF_Site_001_Boston.pdf', contentType: 'pdf', fulfillsRequirement: 'req-022' },
                                { id: 'cnt-017a', name: 'Protocol_Site_001.pdf', contentType: 'pdf', fulfillsRequirement: 'req-020' },
                                { id: 'cnt-017b', name: 'IB_Site_001.pdf', contentType: 'pdf', fulfillsRequirement: 'req-021' },
                                { id: 'cnt-017c', name: 'CRF_Site_001.pdf', contentType: 'pdf', fulfillsRequirement: 'req-023' },
                                { id: 'cnt-017d', name: 'SAP_Site_001.pdf', contentType: 'pdf', fulfillsRequirement: 'req-024' },
                                { id: 'cnt-018', name: 'ICF_Site_002_Chicago.pdf', contentType: 'pdf' }
                            ],
                            completedTasks: ['task-020', 'task-021', 'task-022'],
                            completedApprovals: ['approval-001', 'approval-002', 'approval-003'],
                            children: []
                        }
                    ]
                },
                {
                    id: 'col-002-002',
                    name: 'Case Report Forms',
                    typeId: 'ct-003',
                    parentId: 'col-002',
                    level: 2,
                    isFromTemplate: true,
                    isLocked: true,
                    metadata: {
                        owner: 'Data Management',
                        region: 'Global',
                        status: 'Approved'
                    },
                    content: [
                        { id: 'cnt-019', name: 'CRF Completion Guidelines.pdf', contentType: 'pdf', fulfillsRequirement: 'req-023' },
                        { id: 'cnt-019a', name: 'Clinical Study Protocol.pdf', contentType: 'pdf', fulfillsRequirement: 'req-020' },
                        { id: 'cnt-019b', name: 'Investigator Brochure.pdf', contentType: 'pdf', fulfillsRequirement: 'req-021' },
                        { id: 'cnt-019c', name: 'ICF Reference.pdf', contentType: 'pdf', fulfillsRequirement: 'req-022' },
                        { id: 'cnt-019d', name: 'Statistical Analysis Plan.pdf', contentType: 'pdf', fulfillsRequirement: 'req-024' },
                        { id: 'cnt-020', name: 'eCRF User Manual.pdf', contentType: 'pdf' }
                    ],
                    completedTasks: ['task-020', 'task-021', 'task-022'],
                    completedApprovals: ['approval-001', 'approval-002', 'approval-003'],
                    children: []
                }
            ]
        },
        {
            id: 'col-003',
            name: 'Safety & Pharmacovigilance',
            typeId: 'ct-004',
            parentId: 'root',
            level: 1,
            metadata: {
                owner: 'Drug Safety',
                region: 'Global',
                status: 'Active'
            },
            content: [
                { id: 'cnt-021', name: 'Safety Management Plan.pdf', contentType: 'pdf' },
                { id: 'cnt-022', name: 'PSUR Schedule.xlsx', contentType: 'excel' }
            ],
            children: [
                {
                    id: 'col-003-001',
                    name: 'Adverse Event Reports',
                    typeId: 'ct-004',
                    parentId: 'col-003',
                    level: 2,
                    metadata: {
                        owner: 'Pharmacovigilance',
                        region: 'Global',
                        status: 'Ongoing'
                    },
                    content: [
                        { id: 'cnt-023', name: 'AE Reporting SOP.pdf', contentType: 'pdf' },
                        { id: 'cnt-024', name: 'SAE Form Template.docx', contentType: 'word' }
                    ],
                    children: []
                },
                {
                    id: 'col-003-002',
                    name: 'Risk Management',
                    typeId: 'ct-004',
                    parentId: 'col-003',
                    level: 2,
                    metadata: {
                        owner: 'Drug Safety',
                        region: 'Global',
                        status: 'Under Review'
                    },
                    content: [
                        { id: 'cnt-025', name: 'Risk Management Plan.pdf', contentType: 'pdf' },
                        { id: 'cnt-026', name: 'REMS Documentation.pdf', contentType: 'pdf' }
                    ],
                    children: []
                }
            ]
        },
        {
            id: 'col-004',
            name: 'My Working Collection',
            typeId: null,
            parentId: 'root',
            level: 1,
            isFromTemplate: false,
            metadata: {
                owner: 'Sarah Johnson',
                region: 'Personal',
                status: 'Draft'
            },
            content: [
                { id: 'cnt-030', name: 'Meeting Notes - Q1 Review.docx', contentType: 'word' },
                { id: 'cnt-031', name: 'Draft Presentation.pptx', contentType: 'ppt' },
                { id: 'cnt-032', name: 'Reference Materials.pdf', contentType: 'pdf' },
                { id: 'cnt-033', name: 'Data Analysis.xlsx', contentType: 'excel' }
            ],
            children: [
                {
                    id: 'col-004-001',
                    name: 'Research References',
                    typeId: null,
                    parentId: 'col-004',
                    level: 2,
                    isFromTemplate: false,
                    metadata: {
                        owner: 'Sarah Johnson',
                        region: 'Personal',
                        status: 'Active'
                    },
                    content: [
                        { id: 'cnt-034', name: 'Literature Review.pdf', contentType: 'pdf' },
                        { id: 'cnt-035', name: 'Competitor Analysis.xlsx', contentType: 'excel' }
                    ],
                    children: []
                },
                {
                    id: 'col-004-002',
                    name: 'Draft Documents',
                    typeId: null,
                    parentId: 'col-004',
                    level: 2,
                    isFromTemplate: false,
                    metadata: {
                        owner: 'Sarah Johnson',
                        region: 'Personal',
                        status: 'In Progress'
                    },
                    content: [
                        { id: 'cnt-036', name: 'Proposal Draft v1.docx', contentType: 'word' },
                        { id: 'cnt-037', name: 'Budget Estimate.xlsx', contentType: 'excel' }
                    ],
                    children: []
                }
            ]
        }
    ]
};

/**
 * Helper function to get content type icon
 * @param {string} contentType - The content type identifier
 * @returns {string} SLDS icon name
 */
export function getContentTypeIcon(contentType) {
    const iconMap = {
        pdf: 'doctype:pdf',
        word: 'doctype:word',
        excel: 'doctype:excel',
        ppt: 'doctype:ppt',
        image: 'doctype:image',
        video: 'doctype:video',
        html: 'doctype:html',
        zip: 'doctype:zip',
        unknown: 'doctype:unknown'
    };
    return iconMap[contentType] || 'doctype:unknown';
}

/**
 * Helper function to find a collection by ID in the hierarchy
 * @param {Object} root - The root collection object
 * @param {string} id - The collection ID to find
 * @returns {Object|null} The found collection or null
 */
export function findCollectionById(root, id) {
    if (root.id === id) {
        return root;
    }
    if (root.children) {
        for (const child of root.children) {
            const found = findCollectionById(child, id);
            if (found) {
                return found;
            }
        }
    }
    return null;
}

/**
 * Find a content item by id and the collection node that contains it.
 * @param {Object} root
 * @param {string} contentId
 * @returns {{ content: object, parentCollection: object } | null}
 */
export function findContentWithParentById(root, contentId) {
    if (!contentId || !root) {
        return null;
    }
    const visit = (col) => {
        for (const c of col.content || []) {
            if (c.id === contentId) {
                return { content: c, parentCollection: col };
            }
        }
        for (const ch of col.children || []) {
            const r = visit(ch);
            if (r) {
                return r;
            }
        }
        return null;
    };
    return visit(root);
}

/**
 * Helper function to get the path to a collection (for breadcrumbs)
 * @param {Object} root - The root collection object
 * @param {string} id - The target collection ID
 * @param {Array} path - Current path accumulator
 * @returns {Array} Array of collections from root to target
 */
export function getCollectionPath(root, id, path = []) {
    if (root.id === id) {
        return [...path, root];
    }
    if (root.children) {
        for (const child of root.children) {
            const result = getCollectionPath(child, id, [...path, root]);
            if (result) {
                return result;
            }
        }
    }
    return null;
}

/**
 * Get collection type by ID
 * @param {string} typeId - The collection type ID
 * @returns {Object|null} The collection type object
 */
export function getCollectionType(typeId) {
    return collectionTypes.find(type => type.id === typeId) || null;
}

/**
 * Calculate collection completeness for template-based collections
 * Includes recursive calculation of subcollection completeness
 * @param {Object} collection - The collection object
 * @returns {Object} Completeness metrics
 */
export function calculateCompleteness(collection) {
    if (!collection || !collection.isFromTemplate) {
        return null;
    }
    
    const collectionType = getCollectionType(collection.typeId);
    if (!collectionType) {
        return null;
    }
    
    const requiredContent = collectionType.requiredContent || [];
    const requiredTasks = collectionType.requiredTasks || [];
    const requiredApprovals = collectionType.requiredApprovals || [];
    const content = collection.content || [];
    const completedTasks = collection.completedTasks || [];
    const completedApprovals = collection.completedApprovals || [];
    const children = collection.children || [];
    
    // Calculate content completeness
    const fulfilledRequirements = new Set(
        content.filter(c => c.fulfillsRequirement).map(c => c.fulfillsRequirement)
    );
    const contentCompleted = fulfilledRequirements.size;
    const contentTotal = requiredContent.length;
    
    // Calculate task completeness
    const tasksCompleted = completedTasks.length;
    const tasksTotal = requiredTasks.length;
    
    // Calculate approvals completeness
    const approvalsCompleted = completedApprovals.length;
    const approvalsTotal = requiredApprovals.length;
    
    // Calculate subcollection completeness
    let childrenCompleted = 0;
    let childrenTotal = 0;
    const childrenStatus = [];
    
    children.forEach(child => {
        if (child.isFromTemplate) {
            childrenTotal++;
            const childCompleteness = calculateCompleteness(child);
            if (childCompleteness && childCompleteness.percentage === 100) {
                childrenCompleted++;
            }
            childrenStatus.push({
                id: child.id,
                name: child.name,
                percentage: childCompleteness?.percentage || 0,
                isComplete: childCompleteness?.percentage === 100
            });
        }
    });
    
    // Overall percentage (weighted)
    // If no children, weight is split between content, tasks, and approvals
    let percentage;
    if (childrenTotal > 0) {
        const contentPct = contentTotal > 0 ? (contentCompleted / contentTotal) * 100 : 100;
        const tasksPct = tasksTotal > 0 ? (tasksCompleted / tasksTotal) * 100 : 100;
        const approvalsPct = approvalsTotal > 0 ? (approvalsCompleted / approvalsTotal) * 100 : 100;
        const childrenPct = childrenTotal > 0 ? (childrenCompleted / childrenTotal) * 100 : 100;
        percentage = Math.round((contentPct * 0.3) + (tasksPct * 0.2) + (approvalsPct * 0.2) + (childrenPct * 0.3));
    } else {
        const totalItems = contentTotal + tasksTotal + approvalsTotal;
        const completedItems = contentCompleted + tasksCompleted + approvalsCompleted;
        percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    }
    
    // Build content checklist with status
    const contentChecklist = requiredContent.map(req => {
        const fulfilled = content.find(c => c.fulfillsRequirement === req.id);
        return {
            ...req,
            isCompleted: !!fulfilled,
            fulfilledBy: fulfilled || null
        };
    });
    
    // Build task checklist with status
    const taskChecklist = requiredTasks.map(task => ({
        ...task,
        isCompleted: completedTasks.includes(task.id),
        icon: completedTasks.includes(task.id) ? 'utility:check' : 'utility:clock',
        iconVariant: completedTasks.includes(task.id) ? 'success' : '',
        statusClass: completedTasks.includes(task.id) ? 'checklist-item is-complete' : 'checklist-item is-pending',
        statusLabel: completedTasks.includes(task.id) ? 'Complete' : 'Pending'
    }));
    
    // Build approvals checklist with status
    const approvalsChecklist = requiredApprovals.map(approval => ({
        ...approval,
        isCompleted: completedApprovals.includes(approval.id),
        icon: completedApprovals.includes(approval.id) ? 'utility:check' : 'utility:clock',
        iconVariant: completedApprovals.includes(approval.id) ? 'success' : '',
        statusClass: completedApprovals.includes(approval.id) ? 'checklist-item is-complete' : 'checklist-item is-pending',
        statusLabel: completedApprovals.includes(approval.id) ? 'Approved' : 'Pending'
    }));
    
    // Calculate totals including children and approvals
    const totalItemsWithChildren = contentTotal + tasksTotal + approvalsTotal + childrenTotal;
    const completedItemsWithChildren = contentCompleted + tasksCompleted + approvalsCompleted + childrenCompleted;
    
    return {
        percentage,
        contentCompleted,
        contentTotal,
        tasksCompleted,
        tasksTotal,
        approvalsCompleted,
        approvalsTotal,
        childrenCompleted,
        childrenTotal,
        childrenStatus,
        totalCompleted: completedItemsWithChildren,
        totalRequired: totalItemsWithChildren,
        contentChecklist,
        taskChecklist,
        approvalsChecklist,
        additionalContent: content.filter(c => !c.fulfillsRequirement)
    };
}

/**
 * Deep clone a collection node (for immutable updates)
 * @param {Object} node - Collection node
 * @returns {Object} Cloned node
 */
function cloneCollectionNode(node) {
    const cloned = { ...node };
    if (cloned.children && cloned.children.length > 0) {
        cloned.children = cloned.children.map(child => cloneCollectionNode(child));
    }
    if (cloned.content) {
        cloned.content = [...cloned.content];
    }
    if (cloned.metadata) {
        cloned.metadata = { ...cloned.metadata };
    }
    return cloned;
}

/**
 * Build a new collection from a template with auto-created subcollections and optional default members.
 * Template requirements (content, tasks, approvals) appear empty so the collection shows 0% until the user adds items.
 * @param {Object} template - Collection type/template (from collectionTypes)
 * @param {string} newId - Unique id for the new root collection
 * @param {string} name - Collection name from the create form
 * @param {Object} metadata - Metadata (region, status, description)
 * @returns {Object} New collection node ready to add to the tree
 */
export function buildNewCollectionFromTemplate(template, newId, name, metadata) {
    const hasApprovals = template.requiredApprovals && template.requiredApprovals.length > 0;
    const defaultChildren = template.defaultChildCollections || [];
    const defaultMembers = template.defaultMembers || [];

    const children = defaultChildren.map((def, index) => ({
        id: `${newId}-${index}`,
        name: def.name,
        typeId: def.typeId || template.id,
        parentId: newId,
        level: 2,
        isFromTemplate: true,
        metadata: {
            region: metadata.region || 'Global',
            status: metadata.status || 'Draft',
            description: ''
        },
        content: [],
        completedTasks: [],
        ...(hasApprovals && { completedApprovals: [] }),
        children: [],
        members: []
    }));

    const members = defaultMembers.map((m, index) => ({
        id: `m-${newId}-${index}`,
        name: m.name,
        role: m.role || 'Viewer'
    }));

    return {
        id: newId,
        name,
        typeId: template.id,
        parentId: 'root',
        level: 1,
        isFromTemplate: true,
        metadata: {
            region: metadata.region || 'Global',
            status: metadata.status || 'Draft',
            description: metadata.description || ''
        },
        content: [],
        completedTasks: [],
        ...(hasApprovals && { completedApprovals: [] }),
        children,
        members
    };
}

/**
 * Add a new top-level collection to the root. Returns a new root object (immutable).
 * @param {Object} root - The root collection (e.g. sampleCollections)
 * @param {Object} newCollection - New collection to add as a root child
 * @returns {Object} New root with the added collection
 */
export function addRootCollection(root, newCollection) {
    const clonedRoot = cloneCollectionNode(root);
    clonedRoot.children = [...(clonedRoot.children || []), newCollection];
    return clonedRoot;
}

/**
 * Build a flat pool of all content in the system (from collections + content library)
 * for AI-driven "Find Required Content" recommendations.
 * @param {Object} root - The root collection tree (e.g. sampleCollections)
 * @returns {Array<{ id: string, name: string, contentType: string, sourceCollectionName: string, description?: string }>}
 */
function buildSystemContentPool(root) {
    const pool = [];
    function walk(node, collectionName) {
        const name = node.name || 'Unnamed';
        if (node.content && node.content.length) {
            const collectionStatus = node.metadata?.status || 'Draft';
            node.content.forEach(c => {
                pool.push({
                    id: c.id,
                    name: c.name,
                    contentType: c.contentType || 'unknown',
                    sourceCollectionName: collectionName,
                    description: c.description || null,
                    status: c.status || collectionStatus
                });
            });
        }
        (node.children || []).forEach(child => walk(child, child.name || name));
    }
    if (root.children) {
        root.children.forEach(child => walk(child, child.name || ''));
    }
    // Add content library items (standalone documents that can be recommended)
    const library = [
        { id: 'lib-001', name: 'Module 1 Administrative Documents.pdf', contentType: 'pdf', contentTypeLabel: 'Regulatory Document', sourceCollectionName: 'Content Library', description: 'Regional administrative information', status: 'Approved' },
        { id: 'lib-002', name: 'Module 3 Quality Documentation.pdf', contentType: 'pdf', contentTypeLabel: 'Case Study', sourceCollectionName: 'Content Library', description: 'CMC documentation', status: 'Approved' },
        { id: 'lib-003', name: 'Environmental Assessment.pdf', contentType: 'pdf', contentTypeLabel: 'Email Promo', sourceCollectionName: 'Content Library', description: 'Environmental impact assessment', status: 'Under Review' },
        { id: 'lib-004', name: 'Medication Guide - Draft.pdf', contentType: 'pdf', contentTypeLabel: 'Patient-Facing Content', sourceCollectionName: 'Content Library', description: 'FDA medication guide', status: 'Draft' },
        { id: 'lib-005', name: 'Patient Package Insert.pdf', contentType: 'pdf', contentTypeLabel: 'Patient-Facing Content', sourceCollectionName: 'Content Library', description: 'Patient-facing leaflet', status: 'Approved' },
        { id: 'lib-006', name: 'Highlights Section.pdf', contentType: 'pdf', contentTypeLabel: 'Regulatory Document', sourceCollectionName: 'Content Library', description: 'Key safety and efficacy highlights', status: 'Approved' },
        { id: 'lib-007', name: 'Informed Consent Form Template.pdf', contentType: 'pdf', contentTypeLabel: 'Clinical Document', sourceCollectionName: 'Content Library', description: 'IRB-approved ICF template', status: 'Approved' },
        { id: 'lib-008', name: 'Case Report Form Guidelines.pdf', contentType: 'pdf', contentTypeLabel: 'Clinical Document', sourceCollectionName: 'Content Library', description: 'CRF completion guidelines', status: 'Draft' },
        { id: 'lib-009', name: 'Statistical Analysis Plan Template.pdf', contentType: 'pdf', contentTypeLabel: 'Case Study', sourceCollectionName: 'Content Library', description: 'Pre-specified SAP', status: 'In Progress' },
        { id: 'lib-010', name: 'Risk Management Plan - Master.pdf', contentType: 'pdf', contentTypeLabel: 'Regulatory Document', sourceCollectionName: 'Content Library', description: 'EU RMP or US REMS', status: 'Approved' }
    ];
    library.forEach(l => pool.push(l));
    return pool;
}

/**
 * Recommend content from the system pool for each required content item (simulated AI matching).
 * Uses collection metadata, required item name/description/contentType to pick best candidate.
 * @param {Array<{ id: string, name: string, contentType: string, description?: string }>} requiredItems - Required content items (e.g. from template)
 * @param {Object} root - The root collection tree to scrape content from
 * @param {Set<string>} [excludeContentIds] - Content IDs to exclude (e.g. already in current collection)
 * @returns {Array<{ requiredItem: Object, suggestedContent: Object, confidence: string }>}
 */
export function recommendContentForRequired(requiredItems, root, excludeContentIds = new Set()) {
    const pool = buildSystemContentPool(root);
    const used = new Set();
    const results = [];
    const normalize = (s) => (s || '').toLowerCase().replace(/\s+/g, ' ');
    for (const req of requiredItems) {
        const reqNorm = normalize(req.name);
        const reqDescNorm = normalize(req.description);
        const reqType = (req.contentType || '').toLowerCase();
        let best = null;
        let bestScore = -1;
        for (const c of pool) {
            if (excludeContentIds.has(c.id) || used.has(c.id)) continue;
            let score = 0;
            if (c.contentType === reqType) score += 10;
            if (reqNorm && normalize(c.name).includes(reqNorm)) score += 8;
            if (reqNorm && normalize(c.name).split(/\s/).some(w => reqNorm.includes(w) && w.length > 3)) score += 4;
            if (reqDescNorm && c.description && normalize(c.description).includes(reqDescNorm)) score += 5;
            if (reqDescNorm && c.description && reqDescNorm.split(/\s/).some(w => normalize(c.description).includes(w) && w.length > 3)) score += 3;
            if (score > bestScore) {
                bestScore = score;
                best = c;
            }
        }
        if (best) {
            used.add(best.id);
            results.push({
                requiredItem: req,
                suggestedContent: { ...best, id: best.id, name: best.name, contentType: best.contentType },
                confidence: bestScore >= 10 ? 'high' : bestScore >= 5 ? 'medium' : 'low'
            });
        } else {
            results.push({ requiredItem: req, suggestedContent: null, confidence: 'none' });
        }
    }
    return results;
}
