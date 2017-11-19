export default {
    TYPE: 'anyform-tree',
    drop: (props, monitor, component) => {},
    buildPath: () => null,
    node: (node) => node.title,
    id: (node) => node.id,
    containsLabel: (id) => null,
    containsNormalized: (node) => {
        if (!node.contains || !node.contains.length) return [];
        return [{id: '', value: node.contains}];
    }
}