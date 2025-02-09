import React, { useState, useEffect, useMemo } from "react";

import { ChevronRight, ChevronDown } from "lucide-react";
import { Checkbox } from "~/components/shadcn/checkbox";
import { parseADPaths } from "~/utils/ad-tree-parser";

interface TreeNode {
  name: string;
  children: TreeNode[];
  fullPath: string;
}

interface TreeNodeProps {
  node: TreeNode;
  selectedPath: string | null;
  onSelect: (path: string | null) => void;
  openNodes: Record<string, boolean>;
  onToggleOpen: (path: string) => void;
  level: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  selectedPath,
  onSelect,
  openNodes,
  onToggleOpen,
  level,
}) => {
  const isOpen = openNodes[node.fullPath];
  const isSelected = selectedPath === node.fullPath;

  const handleSelect = (checked: boolean) => {
    onSelect(checked ? node.fullPath : null);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleOpen(node.fullPath);
  };

  return (
    <div className="ml-4">
      <div
        className="flex cursor-pointer items-center py-1 hover:bg-gray-100"
        onClick={handleToggle}
      >
        <div style={{ width: `${level * 20}px` }} />
        {node.children.length > 0 && (
          <span className="mr-1">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        )}
        <Checkbox
          checked={isSelected}
          onCheckedChange={handleSelect}
          onClick={(e) => e.stopPropagation()}
          className="mr-2"
        />
        <span>{node.name}</span>
      </div>
      {isOpen &&
        node.children.map((child, index) => (
          <TreeNode
            key={index}
            node={child}
            selectedPath={selectedPath}
            onSelect={onSelect}
            openNodes={openNodes}
            onToggleOpen={onToggleOpen}
            level={level + 1}
          />
        ))}
    </div>
  );
};

interface ADTreeViewProps {
  paths: string[];
  initialOpenDepth?: number | "fully";
}

const ADTreeViewSelector: React.FC<ADTreeViewProps> = ({
  paths,
  initialOpenDepth = 1,
}) => {
  const tree = useMemo(() => parseADPaths(paths), [paths]);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [openNodes, setOpenNodes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const initialOpenNodes: Record<string, boolean> = {};
    const initializeOpenNodes = (node: TreeNode, depth: number) => {
      if (initialOpenDepth === "fully" || depth < initialOpenDepth) {
        initialOpenNodes[node.fullPath] = true;
        node.children.forEach((child) => initializeOpenNodes(child, depth + 1));
      }
    };
    initializeOpenNodes(tree, 0);
    setOpenNodes(initialOpenNodes);
  }, [tree, initialOpenDepth]);

  const handleSelect = (path: string | null) => {
    setSelectedPath(path);
  };

  const handleToggleOpen = (path: string) => {
    setOpenNodes((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <h2 className="mb-4 text-xl font-bold">AD Tree View</h2>
      <div className="mb-4">
        <TreeNode
          node={tree}
          selectedPath={selectedPath}
          onSelect={handleSelect}
          openNodes={openNodes}
          onToggleOpen={handleToggleOpen}
          level={0}
        />
      </div>
      {selectedPath && (
        <div className="mt-4 rounded bg-gray-100 p-2">
          <h3 className="font-semibold">Selected Path:</h3>
          <p className="font-mono text-sm">{selectedPath}</p>
        </div>
      )}
    </div>
  );
};

export default ADTreeViewSelector;
