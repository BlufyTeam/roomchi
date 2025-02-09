interface TreeNode {
  name: string;
  children: TreeNode[];
  fullPath: string;
}

export function parseADPaths(paths: string[]): TreeNode {
  const root: TreeNode = { name: "Root", children: [], fullPath: "" };

  paths.forEach((path) => {
    const parts = path.split(",");
    let currentNode = root;
    let fullPath = "";

    parts.forEach((part, index) => {
      const [key, value] = part.split("=");
      fullPath = index === 0 ? part : `${part},${fullPath}`;

      let child = currentNode.children.find((c) => c.name === value);
      if (!child) {
        child = { name: value, children: [], fullPath };
        currentNode.children.push(child);
      }
      currentNode = child;
    });
  });

  return root;
}
