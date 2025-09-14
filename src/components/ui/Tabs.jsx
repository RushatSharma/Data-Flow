import React, { useState, createContext, useContext } from "react";
import { cn } from "../../lib/utils";

// Create a context to share the active tab state between components.
const TabsContext = createContext();

// The main Tabs component that manages the state.
const Tabs = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
};

// The container for the tab buttons.
const TabsList = ({ children, className }) => (
  <div className={cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className)}>
    {children}
  </div>
);

// A single tab button.
const TabsTrigger = ({ value, children, className }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all",
        isActive ? "bg-background text-foreground shadow" : "hover:bg-background/50",
        className
      )}
    >
      {children}
    </button>
  );
};

// The content panel that shows when its corresponding tab is active.
const TabsContent = ({ value, children, className }) => {
  const { activeTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return isActive ? <div className={cn("mt-2", className)}>{children}</div> : null;
};

export { Tabs, TabsList, TabsTrigger, TabsContent };