export default {
    TYPE: 'anyform-tree',
    drop: (props, monitor, component) => {},
    buildPath: (path, id) => (path ? path + '.' : '') + id,
    node: (node) => node.title,
    id: (node) => node && node.id,
    containsLabel: (id) => null,
    containsNormalized: (node) => {
        return [{id: '', value: node.contains}];
    }
}