"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const TreeContext = React.createContext({
  indent: 20,
  currentItem: undefined,
  tree: undefined,
});

function useTreeContext() {
  return React.useContext(TreeContext);
}

function Tree({ indent = 20, tree, className, ...props }) {
  const containerProps =
    tree && typeof tree.getContainerProps === "function"
      ? tree.getContainerProps()
      : {};
  const mergedProps = { ...props, ...containerProps };

  const { style: propStyle, ...otherProps } = mergedProps;

  const mergedStyle = {
    ...propStyle,
    "--tree-indent": `${indent}px`,
  };

  return (
    <TreeContext.Provider value={{ indent, tree }}>
      <div
        data-slot="tree"
        style={mergedStyle}
        className={cn("flex flex-col", className)}
        {...otherProps}
      />
    </TreeContext.Provider>
  );
}

function TreeItem({
  item,
  className,
  asChild,
  children,
  ...props
}) {
  const { indent } = useTreeContext();

  const itemProps = typeof item.getProps === "function" ? item.getProps() : {};
  const mergedProps = { ...props, ...itemProps };

  const { style: propStyle, ...otherProps } = mergedProps;

  const level = typeof item.getItemMeta === "function" ? item.getItemMeta().level : 0;
  const mergedStyle = {
    ...propStyle,
    "--tree-padding": `${level * indent}px`,
  };

  const Comp = asChild ? Slot : "button";

  return (
    <TreeContext.Provider value={{ indent, currentItem: item }}>
      <Comp
        data-slot="tree-item"
        style={mergedStyle}
        className={cn(
          "z-10 outline-none select-none focus:z-20 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          className
        )}
        data-focus={
          typeof item.isFocused === "function"
            ? item.isFocused() || false
            : undefined
        }
        data-folder={
          typeof item.isFolder === "function"
            ? item.isFolder() || false
            : undefined
        }
        data-selected={
          typeof item.isSelected === "function"
            ? item.isSelected() || false
            : undefined
        }
        data-drag-target={
          typeof item.isDragTarget === "function"
            ? item.isDragTarget() || false
            : undefined
        }
        data-search-match={
          typeof item.isMatchingSearch === "function"
            ? item.isMatchingSearch() || false
            : undefined
        }
        aria-expanded={typeof item.isExpanded === "function" ? item.isExpanded() : false}
        {...otherProps}
      >
        {children}
      </Comp>
    </TreeContext.Provider>
  );
}

function TreeItemLabel({
  item: propItem,
  children,
  className,
  ...props
}) {
  const { currentItem } = useTreeContext();
  const item = propItem || currentItem;

  if (!item) {
    console.warn("TreeItemLabel: No item provided via props or context");
    return null;
  }

  const isFolder = typeof item.isFolder === "function" ? item.isFolder() : false;
  const isExpanded = typeof item.isExpanded === "function" ? item.isExpanded() : false;

  return (
    <span
      data-slot="tree-item-label"
      className={cn(
        "flex items-center gap-1 rounded-sm px-2 py-1.5 text-sm transition-colors",
        className
      )}
      {...props}
    >
      {isFolder && (
        <ChevronDownIcon 
          className="text-muted-foreground size-4 transition-transform" 
          style={{ 
            transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
            width: '14px',
            height: '14px',
            marginRight: '2px'
          }} 
        />
      )}
      {children ||
        (typeof item.getItemName === "function" ? item.getItemName() : null)}
    </span>
  );
}

function TreeDragLine({
  className,
  ...props
}) {
  const { tree } = useTreeContext();

  if (!tree || typeof tree.getDragLineStyle !== "function") {
    console.warn(
      "TreeDragLine: No tree provided via context or tree does not have getDragLineStyle method"
    )
    return null;
  }

  const dragLine = tree.getDragLineStyle();
  return (
    <div
      style={dragLine}
      className={cn(
        "absolute z-30 -mt-px h-0.5 w-[unset] before:absolute before:-top-[3px] before:left-0 before:size-2 before:rounded-full before:border-2",
        className
      )}
      {...props}
    />
  );
}

export { Tree, TreeItem, TreeItemLabel, TreeDragLine };
