/**
 * Cordim collection — HTML documents and asset folders under src/assets/cordim (lwr localAssets).
 * Root HTML files reference sibling folders (e.g. 01_…/) for css/js/images.
 * Video module removed from the collection and disk to save ~18MB; in-deck links to Video may no longer resolve.
 */
const CORDIM_ASSET_BASE = '/public/assets/cordim';

/** @type {{ id: string, file: string, title: string, contentTypeLabel: string }[]} */
const CORDIM_HTML_CONTENT = [
    {
        id: 'cnt-cordim-01-patients',
        file: 'Patients with arterial hypertension.html',
        title: 'Cordim — Patients with arterial hypertension',
        contentTypeLabel: 'Web Page'
    },
    {
        id: 'cnt-cordim-02-risks',
        file: 'Risks and prevalence.html',
        title: 'Cordim — Risks and prevalence',
        contentTypeLabel: 'Web Page'
    },
    {
        id: 'cnt-cordim-03-graph',
        file: 'Graph.html',
        title: 'Cordim — Graph',
        contentTypeLabel: 'Web Page'
    },
    {
        id: 'cnt-cordim-05-survey',
        file: 'Survey.html',
        title: 'Cordim — Survey',
        contentTypeLabel: 'Web Page'
    },
    {
        id: 'cnt-cordim-06-benefits',
        file: 'Benefits of Cordim.html',
        title: 'Cordim — Benefits of Cordim',
        contentTypeLabel: 'Web Page'
    },
    {
        id: 'cnt-cordim-07-coverage',
        file: 'Cordim coverage.html',
        title: 'Cordim — Cordim coverage',
        contentTypeLabel: 'Web Page'
    },
    {
        id: 'cnt-cordim-08-drugs',
        file: 'Drugs comparison.html',
        title: 'Cordim — Drugs comparison',
        contentTypeLabel: 'Web Page'
    },
    {
        id: 'cnt-cordim-09-guidelines',
        file: 'Guidelines.html',
        title: 'Cordim — Guidelines',
        contentTypeLabel: 'Web Page'
    }
];

/**
 * @returns {Object} Root child collection for sampleCollections
 */
export function getCordimCollection() {
    const content = CORDIM_HTML_CONTENT.map((row) => ({
        id: row.id,
        name: row.file,
        title: row.title,
        contentType: 'html',
        contentTypeLabel: row.contentTypeLabel,
        version: '1.0',
        status: 'Draft',
        effectiveDates: '01/01/2025 - 12/31/2026',
        previewUrl: `${CORDIM_ASSET_BASE}/${row.file}`
    }));

    return {
        id: 'col-cordim-001',
        name: 'Cordim',
        typeId: 'ct-007',
        parentId: 'root',
        level: 1,
        isFromTemplate: true,
        metadata: {
            owner: 'Regulatory',
            region: 'US',
            status: 'In Progress'
        },
        content,
        completedTasks: [],
        children: []
    };
}
