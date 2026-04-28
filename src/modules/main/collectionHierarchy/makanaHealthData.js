/**
 * Makana Health demo collection: template-based root + "Individual Slides" subcollection.
 * PDFs are served from /public/assets (see lwr.config.json localAssets).
 * On-disk files remain 01_makana.pdf…35_makana.pdf; display names use slide-topic titles below.
 */
const PREVIEW_SALESAID = '/public/assets/makana-health/makana-oncura-salesaid.pdf';
const SLIDES_DIR =
    '/public/assets/makana-health/individual-slides/Makana Health - Individual Slides';

/**
 * Titles aligned to a typical ONCURA® (oncurimab) HCP / sales deck (cover → references).
 * Index 0 = slide 01, … index 34 = slide 35.
 * @type {string[]}
 */
const MAKANA_INDIVIDUAL_SLIDE_TOPICS = [
    'Cover — ONCURA (oncurimab) overview',
    'Important safety information (ISI) highlights',
    'ONCURA — brand positioning and value story',
    'Disease state and unmet need',
    'Clinical need and treatment landscape',
    'Mechanism of action and target binding',
    'Receptor binding and selectivity data',
    'Dosing, route of administration, and titration',
    'Clinical program overview and evidence summary',
    'Pivotal trial design and study population',
    'Primary endpoint — efficacy response rate',
    'Key secondary and exploratory outcomes',
    'Efficacy by subgroups and line of therapy',
    'Pooled safety summary',
    'Adverse events and tolerability',
    'Laboratory findings and monitoring',
    'Dosing in renal impairment',
    'Dosing in hepatic impairment',
    'Pregnancy, lactation, and contraception',
    'Pediatric and older-adult use considerations',
    'Drug-drug interaction overview',
    'Contraindications, warnings, and precautions',
    'Overdosage, supportive care, and product handling',
    'Reconstitution, storage, and stability',
    'Immunogenicity and antidrug antibody',
    'Immunomodulation and long-term follow-up (efficacy readouts)',
    'Dosing modifications for adverse events',
    'HCP and patient support programs',
    'Payer, access, and services overview',
    'Efficacy vs key competitors — context',
    'Dosing in special populations and comorbidities (summary)',
    'Efficacy and safety — pooled analyses',
    'HCP training and resources',
    'Payer, contracting, and distribution',
    'Key takeaways, FAQs, and references (slide deck close)'
];

/**
 * @param {string} base
 * @returns {string} filename-safe string with .pdf (no path separators)
 */
function toDisplayPdfName(base) {
    const safe = base
        .replace(/[/\\:*?"<>|]+/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/^\.+/, '')
        .trim();
    return `${safe}.pdf`;
}

/**
 * @returns {Object} Root collection node for sampleCollections.children
 */
export function getMakanaHealthCollection() {
    const slideContent = [];
    for (let n = 1; n <= 35; n += 1) {
        const num = String(n).padStart(2, '0');
        const topic = MAKANA_INDIVIDUAL_SLIDE_TOPICS[n - 1] || `Slide ${num}`;
        slideContent.push({
            id: `cnt-makana-slide-${num}`,
            name: toDisplayPdfName(topic),
            title: `Makana Health — ${topic}`,
            contentType: 'pdf',
            contentTypeLabel: 'Slide',
            version: '1.0',
            status: 'Draft',
            previewUrl: `${SLIDES_DIR}/${num}_makana.pdf`
        });
    }

    return {
        id: 'col-makana-001',
        name: 'Makana Health',
        typeId: 'ct-007',
        parentId: 'root',
        level: 1,
        isFromTemplate: true,
        metadata: {
            owner: 'Makana Regulatory',
            region: 'US',
            status: 'In Progress'
        },
        content: [
            {
                id: 'cnt-makana-salesaid',
                name: 'Makana Health - ONCURA® (oncurimab) - SalesAid.pdf',
                title: 'Makana Health — ONCURA® (oncurimab) Sales Aid',
                contentType: 'pdf',
                contentTypeLabel: 'Sales Aid',
                version: '1.0',
                status: 'Draft',
                effectiveDates: '01/01/2025 - 12/31/2030',
                fulfillsRequirement: 'req-061',
                previewUrl: PREVIEW_SALESAID
            }
        ],
        completedTasks: [],
        children: [
            {
                id: 'col-makana-001-001',
                name: 'Individual Slides',
                typeId: 'ct-007',
                parentId: 'col-makana-001',
                level: 2,
                isFromTemplate: true,
                metadata: {
                    owner: 'Makana Regulatory',
                    region: 'US',
                    status: 'In Progress'
                },
                content: slideContent,
                completedTasks: [],
                children: []
            }
        ]
    };
}
