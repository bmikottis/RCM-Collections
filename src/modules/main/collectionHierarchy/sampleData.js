/**
 * Sample hierarchical collection data for the Collection Hierarchy View prototype.
 * Life Sciences industry focused - regulatory content management.
 */

// Collection Types/Templates with requirements
export const collectionTypes = [
    { 
        id: 'ct-001', 
        name: 'Regulatory Submission', 
        icon: 'standard:approval',
        requiredContent: [
            { id: 'req-001', name: 'Submission Cover Letter', contentType: 'pdf', description: 'Official cover letter for regulatory submission' },
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
        ]
    },
    { 
        id: 'ct-002', 
        name: 'Product Labeling', 
        icon: 'standard:document',
        requiredContent: [
            { id: 'req-010', name: 'Full Prescribing Information', contentType: 'pdf', description: 'Complete prescribing information document' },
            { id: 'req-011', name: 'Highlights Section', contentType: 'pdf', description: 'Key safety and efficacy highlights' },
            { id: 'req-012', name: 'Patient Package Insert', contentType: 'pdf', description: 'Patient-facing information leaflet' },
            { id: 'req-013', name: 'Medication Guide', contentType: 'pdf', description: 'FDA-required medication guide' }
        ],
        requiredTasks: [
            { id: 'task-010', name: 'Medical/Legal/Regulatory review', category: 'Review' },
            { id: 'task-011', name: 'Label reconciliation complete', category: 'Verification' }
        ]
    },
    { 
        id: 'ct-003', 
        name: 'Clinical Trial Documentation', 
        icon: 'standard:record',
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
        ]
    },
    { 
        id: 'ct-004', 
        name: 'Safety Documentation', 
        icon: 'standard:case',
        requiredContent: [
            { id: 'req-030', name: 'Safety Management Plan', contentType: 'pdf', description: 'Comprehensive safety monitoring plan' },
            { id: 'req-031', name: 'Risk Management Plan', contentType: 'pdf', description: 'EU RMP or US REMS' },
            { id: 'req-032', name: 'PSUR/PBRER Template', contentType: 'pdf', description: 'Periodic safety report template' }
        ],
        requiredTasks: [
            { id: 'task-030', name: 'Safety database reconciliation', category: 'Verification' },
            { id: 'task-031', name: 'Signal detection review', category: 'Review' }
        ]
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
                { id: 'cnt-001', name: 'Submission Cover Letter.pdf', contentType: 'pdf', fulfillsRequirement: 'req-001' },
                { id: 'cnt-002', name: 'Product Summary.docx', contentType: 'word', fulfillsRequirement: 'req-002' },
                { id: 'cnt-002b', name: 'Module 2 CTD Summaries.pdf', contentType: 'pdf', fulfillsRequirement: 'req-004' }
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
                        { id: 'cnt-014', name: 'ICF Master Template.pdf', contentType: 'pdf', fulfillsRequirement: 'req-022' },
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
 * Includes recursive calculation of child collection completeness
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
    
    // Calculate child collection completeness
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
