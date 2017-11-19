export default {
    TYPE: 'anyform-tree',
    drop: (props, monitor, component) => {},
    buildPath: (path, id) => (path ? path + '.' : '') + id,
    node: (node) => node.title,
    id: (node) => node.id,
    containsLabel: (id) => null,
    containsNormalized: (node) => {
        if (!node.contains || !node.contains.length) return [];
        return [{id: '', value: node.contains}];
    }
}