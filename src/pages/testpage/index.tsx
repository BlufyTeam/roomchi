import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Checkbox } from "~/components/shadcn/checkbox";
import { boolean } from "zod";

// const adPaths = [
//   "OU=Domain Controllers,DC=RougineDarou,DC=com",
//   "OU=Client Computers,DC=RougineDarou,DC=com",
//   "OU=Client PCs,OU=Client Computers,DC=RougineDarou,DC=com",
//   "OU=Client Laptops,OU=Client Computers,DC=RougineDarou,DC=com",
//   "OU=GPO,OU=Client Laptops,OU=Client Computers,DC=RougineDarou,DC=com",
//   "OU=Admin Users,DC=RougineDarou,DC=com",
//   "OU=IT-USERS,OU=Admin Users,DC=RougineDarou,DC=com",
//   "OU=Client Users,DC=RougineDarou,DC=com",
//   "OU=Rouginedarou,OU=Client Users,DC=RougineDarou,DC=com",
//   "OU=Other Users,OU=Client Users,DC=RougineDarou,DC=com",
//   "OU=Internet Groups,OU=Client Users,DC=RougineDarou,DC=com",
//   "OU=IT,DC=RougineDarou,DC=com",
//   "OU=Rouginedarou,OU=IT,DC=RougineDarou,DC=com",
//   "OU=Client Users,OU=Rouginedarou,OU=IT,DC=RougineDarou,DC=com",
//   "OU=Systemic Users,DC=RougineDarou,DC=com",
//   "OU=Servers,DC=RougineDarou,DC=com",
//   "OU=Disabled Users,DC=RougineDarou,DC=com",
//   "OU=Groups,DC=RougineDarou,DC=com",
// ];
const adPaths = [
  "OU=Domain Controllers,DC=RougineDarou,DC=com",
  "OU=Client Computers,DC=RougineDarou,DC=com",
  "OU=Admin Users,DC=RougineDarou,DC=com",
  "OU=Client Users,DC=RougineDarou,DC=com",
  "OU=Groups,DC=RougineDarou,DC=com",
  "OU=Client PCs,OU=Client Computers,DC=RougineDarou,DC=com",
  "OU=Client Laptops,OU=Client Computers,DC=RougineDarou,DC=com",
  "OU=Systemic Users,DC=RougineDarou,DC=com",
  "OU=Rouginedarou,OU=Client Users,DC=RougineDarou,DC=com",
  "OU=Servers,DC=RougineDarou,DC=com",
  "OU=Disabled Users,DC=RougineDarou,DC=com",
  "OU=GPO,OU=Client Laptops,OU=Client Computers,DC=RougineDarou,DC=com",
  "OU=Other Users,OU=Client Users,DC=RougineDarou,DC=com",
  "OU=IT,OU=Rouginedarou,OU=Client Users,DC=RougineDarou,DC=com",
  "OU=IT-USERS,OU=Admin Users,DC=RougineDarou,DC=com",
  "OU=Internet Groups,OU=Client Users,DC=RougineDarou,DC=com",
];

type TreeNode = {
  name: string;
  children: Record<string, TreeNode>;
};

function buildTree(paths: string[]): TreeNode {
  const root: TreeNode = { name: "RougineDarou", children: {} };

  paths.forEach((path) => {
    const parts = path
      .split(",")
      .map((part) => part.replace("OU=", "").replace("DC=", "").trim());
    let currentNode = root;

    parts.forEach((part, index) => {
      if (!currentNode.children[part]) {
        currentNode.children[part] = {
          name: part,
          children: {},
        };
      }
      currentNode = currentNode.children[part];
    });
  });

  return root;
}
// Function to build the LDAP tree from a list of distinguished names
// const buildTree = (dnList) => {
//   const root = { name: "Root", fullPath: "", children: [] };
//   const nodeMap = { "": root };

//   dnList?.forEach((dn) => {
//     const parts = dn.split(",").reverse();
//     let currentPath = "";
//     let parent = root;

//     parts.forEach((part) => {
//       if (!part.startsWith("OU=")) return;
//       const name = part.replace("OU=", "");
//       currentPath = currentPath ? `${part},${currentPath}` : part;

//       if (!nodeMap[currentPath]) {
//         const newNode = { name, fullPath: currentPath, children: [] };
//         nodeMap[currentPath] = newNode;
//         parent.children.push(newNode);
//       }
//       parent = nodeMap[currentPath];
//     });
//   });

//   return root;
// };

const TreeNode = ({ node, onSelect }) => {
  const [expanded, setExpanded] = useState(false);
  const [checked, setChecked] = useState(false);

  return (
    <div dir="ltr" className="ml-4">
      <div className="flex items-center gap-2">
        {node.children.length > 0 && (
          <button onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )}
        <Checkbox
          checked={checked}
          onCheckedChange={(value) => {
            if (typeof value === "boolean") setChecked(value);
            onSelect(node.fullPath, value);
          }}
        />
        <span>{node.name}</span>
      </div>
      {expanded && node.children.length > 0 && (
        <div className="ml-4 border-l pl-2">
          {node.children.map((child) => (
            <TreeNode key={child.fullPath} node={child} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

type TreeViewProps = {
  node: TreeNode;
};

const TreeView: React.FC<TreeViewProps> = ({ node }) => {
  return (
    <div style={{ marginLeft: "20px" }}>
      <div>{node.name}</div>
      {Object.values(node.children).length > 0 && (
        <div>
          {Object.values(node.children).map((childNode) => (
            <TreeView key={childNode.name} node={childNode} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function LDAPTreeView() {
  const [selectedPaths, setSelectedPaths] = useState([]);
  const ldapTree = buildTree(adPaths);
  const handleSelect = (path, isChecked) => {
    setSelectedPaths((prev) => {
      if (isChecked) return [...prev, path];
      return prev.filter((p) => p !== path);
    });
  };

  return (
    <div dir="ltr" className="mx-auto max-w-md rounded-lg border p-4">
      <TreeView node={ldapTree} />
      <h2 className="mb-2 text-lg font-semibold">LDAP Tree</h2>
      <TreeNode node={ldapTree} onSelect={handleSelect} />
      <div className="mt-4 rounded bg-gray-100 p-2">
        <h3 className="text-sm font-medium">Selected Paths:</h3>
        <pre className="text-xs text-gray-700">
          {JSON.stringify(selectedPaths, null, 2)}
        </pre>
      </div>
    </div>
  );
}
