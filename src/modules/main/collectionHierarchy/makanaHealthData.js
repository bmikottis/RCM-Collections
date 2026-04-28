/**
 * Makana Health demo collection: template-based root + "Individual Slides" subcollection.
 * PDFs are served from /public/assets (see lwr.config.json localAssets).
 */
const PREVIEW_SALESAID = '/public/assets/makana-health/makana-oncura-salesaid.pdf';
const SLIDES_DIR =
    '/public/assets/makana-health/individual-slides/Makana Health - Individual Slides';

/**
 * @returns {Object} Root collection node for sampleCollections.children
 */
export function getMakanaHealthCollection() {
    const slideContent = [];
    for (let n = 1; n <= 35; n += 1) {
        const num = String(n).padStart(2, '0');
        slideContent.push({
            id: `cnt-makana-slide-${num}`,
            name: `${num}_makana.pdf`,
            title: `Makana Health — Individual slide ${num}`,
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
