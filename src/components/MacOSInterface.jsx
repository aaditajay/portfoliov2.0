import React, { useState, useEffect } from 'react';
import { portfolioData } from '../data/portfolioData';
import MacOSMenuBar from './MacOSMenuBar';
import MacOSDock from './MacOSDock';
import './MacOSInterface.css';
import { 
  Clock, Users, Compass, Monitor, FileText, Download, Cloud, Home, HardDrive, Radio, Trash2,
  AppWindow, Folder, Tag
} from 'lucide-react';
import { Tree, TreeItem, TreeItemLabel } from './TreeSidebar';

function GlassFilter() {
  return (
    <svg className="hidden" style={{ display: 'none' }}>
      <defs>
        <filter
          id="container-glass"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          {/* Generate turbulent noise for distortion */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.05"
            numOctaves="1"
            seed="1"
            result="turbulence"
          />

          {/* Blur the turbulence pattern slightly */}
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />

          {/* Displace the source graphic with the noise */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="70"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />

          {/* Apply overall blur on the final result */}
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />

          {/* Output the result */}
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

// SVG Icons for Finder Folder Contents
const FileTextIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 2.5px 3px rgba(0,0,0,0.18))' }}>
    {/* Page outline */}
    <path d="M12 6C12 4.89543 12.8954 4 14 4H42L52 14V58C52 59.1046 51.1046 60 50 60H14C12.8954 60 12 59.1046 12 58V6Z" fill="#FFFFFF" stroke="#CCCCCC" strokeWidth="1.2" />
    {/* Dog-ear corner fold */}
    <path d="M42 4V14H52" fill="#EAEAEA" stroke="#CCCCCC" strokeWidth="1.2" />
    <path d="M42 4L52 14" stroke="#CCCCCC" strokeWidth="1.2" />
    {/* Detailed text lines representing paragraph formatting */}
    <rect x="20" y="22" width="24" height="1.8" rx="0.9" fill="#8E8E93" />
    <rect x="20" y="28" width="18" height="1.8" rx="0.9" fill="#AEAEB2" />
    <rect x="20" y="34" width="24" height="1.8" rx="0.9" fill="#AEAEB2" />
    <rect x="20" y="40" width="14" height="1.8" rx="0.9" fill="#C7C7CC" />
    {/* Decorative blue accents at the bottom */}
    <path d="M20 48H32M20 52H26" stroke="#007AFF" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const FileLinkIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 2.5px 3px rgba(0,0,0,0.18))' }}>
    {/* Page outline */}
    <path d="M12 6C12 4.89543 12.8954 4 14 4H42L52 14V58C52 59.1046 51.1046 60 50 60H14C12.8954 60 12 59.1046 12 58V6Z" fill="#FFFFFF" stroke="#CCCCCC" strokeWidth="1.2" />
    <path d="M42 4V14H52" fill="#EAEAEA" stroke="#CCCCCC" strokeWidth="1.2" />
    <path d="M42 4L52 14" stroke="#CCCCCC" strokeWidth="1.2" />
    {/* Compass dial in the middle */}
    <circle cx="32" cy="36" r="11" fill="#F2F8FF" stroke="#007AFF" strokeWidth="1.5" />
    {/* Compass needle */}
    <path d="M35.5 32.5L33.5 35L32 36L28.5 39.5L29.5 37L32 36L35.5 32.5Z" fill="#FF3B30" stroke="#FF3B30" strokeWidth="0.3" />
    <path d="M28.5 39.5L29.5 37L32 36L28.5 39.5Z" fill="#007AFF" stroke="#007AFF" strokeWidth="0.3" />
    <circle cx="32" cy="36" r="0.8" fill="#FFFFFF" />
  </svg>
);

export default function MacOSInterface({ onExit }) {
  const [openWindows, setOpenWindows] = useState([]);
  const [windowOrder, setWindowOrder] = useState([]);
  const [activeAppName, setActiveAppName] = useState('Finder');

  // Sidebar tree expanded state
  const [expandedItems, setExpandedItems] = useState({
    favorites_header: true,
    locations_header: true,
    desktop: true,
    experience: true,
    projects: true
  });

  // Selected items inside Finder grids
  const [selectedItemIds, setSelectedItemIds] = useState({});

  const handleFinderItemClick = (e, item, winId) => {
    e.stopPropagation();
    setSelectedItemIds(prev => ({
      ...prev,
      [winId]: item.id
    }));
  };

  const handleFinderBackgroundClick = (winId) => {
    setSelectedItemIds(prev => ({
      ...prev,
      [winId]: null
    }));
  };


  // Project screenshots map matching local assets
  const projectScreenshots = {
    'dark-netra': [
      { name: 'dashboard.png', url: '/macos/screenshots/media__1781187771741.png' },
      { name: 'threat-map.png', url: '/macos/screenshots/media__1781166261733.png' }
    ],
    'zindasic': [
      { name: 'player-ui.jpg', url: '/macos/screenshots/media__1781186569021.jpg' }
    ],
    'being-basheer': [
      { name: 'poetry-generator.png', url: '/macos/screenshots/media__1781187771746.png' }
    ],
    'pursuit-of-hiring': [
      { name: 'mock-interview.png', url: '/macos/screenshots/media__1781203884936.png' },
      { name: 'evaluations.jpg', url: '/macos/screenshots/media__1781204609582.jpg' }
    ],
    'njan-aara': [
      { name: 'discovery-flow.png', url: '/macos/screenshots/media__1781204400206.png' },
      { name: 'career-map.jpg', url: '/macos/screenshots/media__1781204713646.jpg' }
    ]
  };

  const getFolderTitle = (folderKey) => {
    if (folderKey === 'desktop') return 'Desktop';
    if (folderKey === 'about') return 'About Me';
    if (folderKey === 'experience') return 'Experience';
    if (folderKey === 'expertise') return 'Expertise';
    if (folderKey === 'projects') return 'Projects';
    if (folderKey === 'contact') return 'Contact';
    if (folderKey.startsWith('project-folder-')) {
      const id = folderKey.replace('project-folder-', '');
      const proj = portfolioData.projects.find(p => p.id === id);
      return proj ? proj.name : 'Project';
    }
    if (folderKey.startsWith('project-images-')) {
      return 'Images';
    }
    return 'Folder';
  };

  const navigateFinder = (windowId, folderKey, title) => {
    setOpenWindows(prev => prev.map(win => {
      if (win.id === windowId) {
        const newHistory = win.history.slice(0, win.historyIndex + 1);
        if (newHistory[newHistory.length - 1] !== folderKey) {
          newHistory.push(folderKey);
        }
        return {
          ...win,
          folderKey,
          title,
          history: newHistory,
          historyIndex: newHistory.length - 1
        };
      }
      return win;
    }));
  };

  const handleBackClick = (win) => {
    if (win.historyIndex > 0) {
      const newIndex = win.historyIndex - 1;
      const prevFolderKey = win.history[newIndex];
      const title = getFolderTitle(prevFolderKey);
      setOpenWindows(prev => prev.map(w => {
        if (w.id === win.id) {
          return {
            ...w,
            folderKey: prevFolderKey,
            title,
            historyIndex: newIndex
          };
        }
        return w;
      }));
    }
  };

  const handleForwardClick = (win) => {
    if (win.historyIndex < win.history.length - 1) {
      const newIndex = win.historyIndex + 1;
      const nextFolderKey = win.history[newIndex];
      const title = getFolderTitle(nextFolderKey);
      setOpenWindows(prev => prev.map(w => {
        if (w.id === win.id) {
          return {
            ...w,
            folderKey: nextFolderKey,
            title,
            historyIndex: newIndex
          };
        }
        return w;
      }));
    }
  };

  const getFolderItems = (folderKey) => {
    if (folderKey.startsWith('project-folder-')) {
      const projId = folderKey.replace('project-folder-', '');
      const proj = portfolioData.projects.find(p => p.id === projId);
      if (!proj) return [];
      
      const items = [
        { id: `readme-${projId}`, name: 'Readme.md', type: 'file', content: proj.description, title: proj.name },
        { id: `project-images-${projId}`, name: 'Images', type: 'folder-link', title: 'Images', folderKey: `project-images-${projId}` }
      ];

      // GitHub link override and definition
      let githubUrl = proj.github;
      if (projId === 'pursuit-of-hiring') {
        githubUrl = 'https://github.com/aaditajay/pursuitofhiring';
      } else if (projId === 'dark-netra') {
        githubUrl = 'https://github.com/3bin-05/Dark-netra-frontend';
      }

      items.push({
        id: `github-${projId}`,
        name: 'github.url',
        type: 'link',
        url: githubUrl,
        text: `GitHub Repository:\n${githubUrl}\n\nDouble-click to open.`
      });

      // App website link (omit for zindasic as requested)
      if (projId !== 'zindasic' && proj.website) {
        let appName = '';
        if (projId === 'being-basheer') {
          appName = 'Being Basheer';
        } else if (projId === 'njan-aara') {
          appName = 'Njan Aara';
        } else if (projId === 'pursuit-of-hiring') {
          appName = 'The Pursuit of Hiring';
        } else if (projId === 'dark-netra') {
          appName = 'Dark Netra';
        }

        if (appName) {
          items.push({
            id: `website-${projId}`,
            name: appName,
            type: 'link',
            url: proj.website,
            text: `Project Application:\n${proj.website}\n\nDouble-click to open.`
          });
        }
      }

      return items;
    }

    if (folderKey.startsWith('project-images-')) {
      const projId = folderKey.replace('project-images-', '');
      const screenshots = projectScreenshots[projId] || [];
      return screenshots.map((scr, idx) => ({
        id: `img-${projId}-${idx}`,
        name: scr.name,
        type: 'image',
        url: scr.url,
        title: `${scr.name} - Preview`
      }));
    }

    if (folderKey === 'exp-mulearn-foundation') {
      return [
        {
          id: 'mulearn-foundation-readme',
          name: 'Readme.md',
          type: 'file',
          content: `Project Management Intern\n\nFeb 2026 – Present\n\nManaging multiple concurrent projects across cross-functional teams using Agile methodologies. Responsible for project planning, stakeholder coordination, workflow optimization, milestone tracking, and ensuring timely delivery of organizational initiatives.\n\n---\n\nDistrict Lead – Alappuzha\n\nAug 2025 – Present\n\nLeading µLearn operations across multiple campuses in Alappuzha by coordinating campus leadership teams, driving community growth, monitoring progress through OKRs, and enabling collaboration between student leaders and the foundation.\n\n---\n\nDigital Marketing Intern\n\nAug 2025 – Jan 2026\n\nManaged content strategy and social media operations across multiple platforms, contributing to audience growth, engagement, and brand visibility through data-driven campaigns and community-focused storytelling.`,
          title: 'Project Management Intern & District Lead'
        },
        {
          id: 'mulearn-website-link',
          name: 'mulearn.url',
          type: 'link',
          url: 'https://mulearn.org/',
          text: 'µLearn Website:\nhttps://mulearn.org/\n\nDouble-click to open.'
        }
      ];
    }

    if (folderKey === 'exp-mulearn-sbc') {
      return [
        {
          id: 'mulearn-sbc-readme',
          name: 'Readme.md',
          type: 'file',
          content: `Campus Lead\n\nMar 2026 – Present\n\nLeading the campus chapter by overseeing strategic planning, community engagement, volunteer management, and execution of learning initiatives. Working closely with the executive committee to create opportunities that help students learn, connect, and grow.\n\n---\n\nCampus Co-Lead\n\nJan 2025 – Jan 2026\n\nCo-led one of the most active student communities on campus, organizing events, driving participation, mentoring volunteers, and contributing to the chapter's growth and national recognition within the µLearn ecosystem.`,
          title: 'Campus Lead & Co-Lead'
        }
      ];
    }

    if (folderKey === 'exp-ieee-sbce') {
      return [
        {
          id: 'ieee-sbce-readme',
          name: 'Readme.md',
          type: 'file',
          content: `Chairman, Industry Applications Society\n\nMar 2026 – Present\n\nHeading the Industry Applications Society chapter by organizing industry-oriented workshops, speaker sessions, and professional development programs that bridge the gap between academics and real-world engineering practices.\n\n---\n\nMembership Development Coordinator\n\nFeb 2025 – Feb 2026\n\nLed membership engagement initiatives, strengthened collaboration across societies, and coordinated events that improved participation, member retention, and overall branch activity.`,
          title: 'IEEE IAS Chairman & MD Coordinator'
        }
      ];
    }

    if (folderKey === 'exp-purple-movement') {
      return [
        {
          id: 'purple-movement-readme',
          name: 'Readme.md',
          type: 'file',
          content: `Strategic Lead\n\nMay 2025 – Dec 2025\n\nContributed to the planning and execution of large-scale learning experiences, community initiatives, and strategic programs. Worked closely with leadership teams to design systems, coordinate stakeholders, and create impactful experiences for learners across communities.`,
          title: 'Strategic Lead'
        }
      ];
    }

    return folderContents[folderKey] || [];
  };

  const renderTreeSidebar = (win) => {
    const toggleExpand = (itemId) => {
      setExpandedItems(prev => ({
        ...prev,
        [itemId]: !prev[itemId]
      }));
    };

    const allTreeItems = [
      { id: 'favorites_header', name: 'Favorites', level: 0, isFolder: true },
      { id: 'recents', name: 'Recents', level: 1, icon: 'Clock', folderKey: 'recents' },
      { id: 'shared', name: 'Shared', level: 1, icon: 'Users', folderKey: 'shared' },
      { id: 'applications', name: 'Applications', level: 1, icon: 'Compass', folderKey: 'applications' },
      { id: 'desktop', name: 'Desktop', level: 1, icon: 'Monitor', folderKey: 'desktop' },
      { id: 'documents', name: 'Documents', level: 1, icon: 'FileText', folderKey: 'documents' },
      { id: 'downloads', name: 'Downloads', level: 1, icon: 'Download', folderKey: 'downloads' },
      
      { id: 'locations_header', name: 'Locations', level: 0, isFolder: true },
      { id: 'icloud', name: 'iCloud Drive', level: 1, icon: 'Cloud', folderKey: 'icloud' },
      { id: 'home', name: 'aaditajay', level: 1, icon: 'Home', folderKey: 'home' },
      { id: 'mac_hd', name: 'Macintosh HD', level: 1, icon: 'HardDrive', folderKey: 'mac_hd' },
      { id: 'airdrop', name: 'AirDrop', level: 1, icon: 'Radio', folderKey: 'airdrop' },
      { id: 'trash', name: 'Trash', level: 1, icon: 'Trash2', folderKey: 'trash' },

      { id: 'tags_header', name: 'Tags', level: 0, isFolder: true },
      { id: 'tag-red', name: 'Red', level: 1, tagColor: '#ff3b30' },
      { id: 'tag-orange', name: 'Orange', level: 1, tagColor: '#ff9500' },
      { id: 'tag-yellow', name: 'Yellow', level: 1, tagColor: '#ffcc00' },
      { id: 'tag-green', name: 'Green', level: 1, tagColor: '#34c759' },
      { id: 'tag-blue', name: 'Blue', level: 1, tagColor: '#007aff' },
      { id: 'tag-purple', name: 'Purple', level: 1, tagColor: '#af52de' },
      { id: 'tag-gray', name: 'Gray', level: 1, tagColor: '#8e8e93' },
      { id: 'tag-all', name: 'All Tags...', level: 1, icon: 'Tag' }
    ];

    const isItemVisible = (item) => {
      if (item.level === 0) return true;
      let current = item;
      while (current.parentId) {
        const parent = allTreeItems.find(x => x.id === current.parentId);
        if (!parent) return true;
        if (!expandedItems[parent.id]) return false;
        current = parent;
      }
      if (item.level === 1) {
        if (['recents', 'shared', 'applications', 'desktop', 'documents', 'downloads'].includes(item.id)) {
          return expandedItems['favorites_header'];
        }
        if (['icloud', 'home', 'mac_hd', 'airdrop', 'trash'].includes(item.id)) {
          return expandedItems['locations_header'];
        }
        if (item.id.startsWith('tag-')) {
          return expandedItems['tags_header'];
        }
      }
      return true;
    };

    const visibleItems = allTreeItems.filter(isItemVisible);

    const getIconComponent = (iconName) => {
      const props = { className: "sidebar-icon" };
      switch (iconName) {
        case 'Clock': return <Clock {...props} />;
        case 'Users': return <Users {...props} />;
        case 'Compass': return <Compass {...props} />;
        case 'Monitor': return <Monitor {...props} />;
        case 'Folder': return <Folder {...props} />;
        case 'FileText': return <FileText {...props} />;
        case 'Download': return <Download {...props} />;
        case 'Cloud': return <Cloud {...props} />;
        case 'Home': return <Home {...props} />;
        case 'HardDrive': return <HardDrive {...props} />;
        case 'Radio': return <Radio {...props} />;
        case 'Trash2': return <Trash2 {...props} />;
        case 'Tag': return <Tag {...props} />;
        default: return null;
      }
    };

    const getTreeItemInstance = (treeItem) => ({
      id: treeItem.id,
      getItemMeta: () => ({ level: treeItem.level }),
      isFolder: () => !!treeItem.isFolder,
      isExpanded: () => !!expandedItems[treeItem.id],
      isFocused: () => false,
      isSelected: () => win.folderKey === treeItem.folderKey,
      isDragTarget: () => false,
      isMatchingSearch: () => false,
      getItemName: () => treeItem.name,
      getProps: () => ({
        onClick: (e) => {
          if (treeItem.isFolder && (e.target.closest('svg') || treeItem.id.endsWith('_header'))) {
            e.stopPropagation();
            toggleExpand(treeItem.id);
          } else {
            if (treeItem.folderKey) {
              navigateFinder(win.id, treeItem.folderKey, treeItem.name);
            } else if (treeItem.isFolder) {
              toggleExpand(treeItem.id);
            }
          }
        }
      })
    });

    return (
      <Tree indent={12}>
        {visibleItems.map(treeItem => {
          const itemInstance = getTreeItemInstance(treeItem);
          return (
            <TreeItem key={treeItem.id} item={itemInstance}>
              <TreeItemLabel item={itemInstance}>
                {treeItem.tagColor ? (
                  <span 
                    className="sidebar-tag-dot"
                    style={{ 
                      width: '10px', 
                      height: '10px', 
                      borderRadius: '50%', 
                      backgroundColor: treeItem.tagColor, 
                      marginRight: '6px',
                      marginLeft: '3px',
                      display: 'inline-block',
                      flexShrink: 0
                    }} 
                  />
                ) : (
                  !treeItem.isFolder && treeItem.icon && getIconComponent(treeItem.icon)
                )}
                {treeItem.isFolder && !treeItem.id.endsWith('_header') && (
                  <Folder className="sidebar-icon" style={{ marginRight: '2px' }} />
                )}
                <span style={{ marginLeft: treeItem.isFolder && treeItem.id.endsWith('_header') ? 0 : '4px' }}>
                  {treeItem.name}
                </span>
              </TreeItemLabel>
            </TreeItem>
          );
        })}
      </Tree>
    );
  };

  // Drag state
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // 1. Drag handlers mouse effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!draggingId) return;
      const dx = e.clientX - dragOffset.x;
      const dy = e.clientY - dragOffset.y;
      
      const newY = Math.max(32, dy); // constrain to remain below top menubar
      setOpenWindows(prev => prev.map(w => 
        w.id === draggingId ? { ...w, x: dx, y: newY } : w
      ));
    };

    const handleMouseUp = () => {
      setDraggingId(null);
    };

    if (draggingId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingId, dragOffset]);

  // Resize state
  const [resizingId, setResizingId] = useState(null);
  const [resizeStart, setResizeStart] = useState({ w: 0, h: 0, x: 0, y: 0 });

  const startResize = (id, e) => {
    e.stopPropagation();
    e.preventDefault();
    const win = openWindows.find(w => w.id === id);
    if (!win) return;
    setResizingId(id);
    setResizeStart({
      w: win.w,
      h: win.h,
      x: e.clientX,
      y: e.clientY
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!resizingId) return;
      const dx = e.clientX - resizeStart.x;
      const dy = e.clientY - resizeStart.y;
      
      const newW = Math.max(480, resizeStart.w + dx);
      const newH = Math.max(300, resizeStart.h + dy);
      
      setOpenWindows(prev => prev.map(w => 
        w.id === resizingId ? { ...w, w: newW, h: newH } : w
      ));
    };

    const handleMouseUp = () => {
      setResizingId(null);
    };

    if (resizingId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingId, resizeStart]);

  // Sidebar Resize state
  const [sidebarWidth, setSidebarWidth] = useState(160);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [sidebarResizeStartX, setSidebarResizeStartX] = useState(0);
  const [sidebarResizeStartWidth, setSidebarResizeStartWidth] = useState(160);

  const startSidebarResize = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizingSidebar(true);
    setSidebarResizeStartX(e.clientX);
    setSidebarResizeStartWidth(sidebarWidth);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizingSidebar) return;
      const dx = e.clientX - sidebarResizeStartX;
      const newWidth = Math.max(140, Math.min(260, sidebarResizeStartWidth + dx));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizingSidebar(false);
    };

    if (isResizingSidebar) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingSidebar, sidebarResizeStartX, sidebarResizeStartWidth]);

  // Window Z-Index layering
  const focusWindow = (id) => {
    setWindowOrder(prev => {
      const filtered = prev.filter(wId => wId !== id);
      return [...filtered, id];
    });
    // Set active app name based on window type
    const win = openWindows.find(w => w.id === id);
    if (win) {
      setActiveAppName(win.appName || 'Finder');
    }
  };

  const openWindow = (winSpec) => {
    focusWindow(winSpec.id);
    if (openWindows.some(w => w.id === winSpec.id)) {
      // If already open, unminimize and navigate if needed
      setOpenWindows(prev => prev.map(w => 
        w.id === winSpec.id ? { ...w, isMinimized: false } : w
      ));
      if (winSpec.appName === 'Finder' && winSpec.folderKey) {
        navigateFinder(winSpec.id, winSpec.folderKey, winSpec.title);
      }
      return;
    }

    const width = winSpec.w || 480;
    const height = winSpec.h || 320;
    const x = Math.max(60, Math.floor((window.innerWidth - width) / 2) + openWindows.length * 20);
    const y = Math.max(100, Math.floor((window.innerHeight - height) / 2) + openWindows.length * 20);

    const newWindow = {
      ...winSpec,
      x,
      y,
      w: width,
      h: height,
      isMinimized: false,
      isMaximized: false,
      history: winSpec.folderKey ? [winSpec.folderKey] : [],
      historyIndex: 0
    };

    setOpenWindows(prev => [...prev, newWindow]);
    setWindowOrder(prev => [...prev, winSpec.id]);
    setActiveAppName(winSpec.appName || 'Finder');
  };

  const closeWindow = (id, e) => {
    if (e) e.stopPropagation();
    setOpenWindows(prev => prev.filter(w => w.id !== id));
    setWindowOrder(prev => prev.filter(wId => wId !== id));
    setActiveAppName('Finder');
  };

  const toggleMinimize = (id, e) => {
    if (e) e.stopPropagation();
    setOpenWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
    ));
    setActiveAppName('Finder');
  };

  const toggleMaximize = (id, e) => {
    if (e) e.stopPropagation();
    setOpenWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ));
  };

  const startDrag = (id, e) => {
    if (e.target.closest('.traffic-dot')) return; // ignore dragging on traffic lights
    focusWindow(id);
    const win = openWindows.find(w => w.id === id);
    if (!win) return;
    setDraggingId(id);
    setDragOffset({
      x: e.clientX - win.x,
      y: e.clientY - win.y
    });
  };

  // Helper to generate dynamic category experience lists
  const getExperienceContent = (category) => {
    return portfolioData.experience
      .filter(exp => exp.category === category)
      .map((exp, idx) => `${idx + 1}. ${exp.role} @ ${exp.organization}\nDuration: ${exp.duration}\n\n${exp.description}`)
      .join('\n\n---\n\n');
  };

  // Directory explorer content datasets
  const folderContents = {
    about: [
      {
        id: 'about-readme',
        name: 'Readme.md',
        type: 'file',
        content: `Hey, I'm Aadit.\n\nI'm currently a final-year Computer Science and Engineering student at Sree Buddha College of Engineering, Alappuzha, continuously learning, building, and preparing for a future in project management, product development, and leadership.\nI love making things happen.\n\nSometimes that's a software product. Sometimes it's a community, an event, a team, or an idea that needs structure and direction. My background is in Computer Science, but what excites me most is managing projects, solving problems, and bringing people together to build something meaningful.\n\nOver the past few years, I've had the opportunity to lead student communities, manage large-scale initiatives, organize events, and build digital products that solve real problems. Through these experiences, I've discovered that my greatest strength isn't just building things—it's helping people work together towards a shared goal. I enjoy creating clarity, building systems, and turning ambitious ideas into actionable plans.\n\nWhen I'm not managing projects or communities, you'll probably find me building side projects, exploring new technologies, brainstorming ideas, or working on something creative. I'm particularly interested in the intersection of technology, leadership, and human impact where great products and great teams come together to create meaningful change.`,
        title: 'About Me'
      },
      {
        id: 'about-education',
        name: 'Education.md',
        type: 'file',
        content: `B.Tech In Computer Science & Engineering\nSree Buddha College of Engineering, Alappuzha | 2023-2027\nPursuing undergraduate studies under APJ Abdul Kalam Technological University.\nActively leading community initiatives and organising events at campus level alongside academics.\n\n\nHigher Secondary in Computer Science Stream\nSree Buddha Central School, Karunagappally | 2021-2023\nCompleted Higher Secondary Education under the Central Board of Secondary Education (CBSE).\nScored 95 marks in Computer Science. Served as School Leader.`,
        title: 'Education'
      }
    ],
    experience: [
      { id: 'exp-mulearn-foundation-link', name: 'µLearn Foundation', type: 'folder-link', title: 'µLearn Foundation', folderKey: 'exp-mulearn-foundation' },
      { id: 'exp-mulearn-sbc-link', name: 'µLearn SBC', type: 'folder-link', title: 'µLearn SBC', folderKey: 'exp-mulearn-sbc' },
      { id: 'exp-ieee-sbce-link', name: 'IEEE Student Branch SBCE', type: 'folder-link', title: 'IEEE Student Branch SBCE', folderKey: 'exp-ieee-sbce' },
      { id: 'exp-purple-movement-link', name: 'The Purple Movement', type: 'folder-link', title: 'The Purple Movement', folderKey: 'exp-purple-movement' }
    ],
    expertise: [
      {
        id: 'expertise-readme',
        name: 'Readme.md',
        type: 'file',
        content: `Project Management\n\nPlanning, coordinating, and delivering projects from concept to execution. Experienced in managing cross-functional teams, tracking milestones, streamlining workflows, and ensuring successful outcomes through structured execution and Agile methodologies.\n\n\nSoftware Development\n\nBuilding modern web and mobile applications using technologies such as React, Next.js, Flutter, FastAPI, and Python. Focused on creating scalable, user-centric solutions that solve real-world problems.\n\n\nStrategic Thinking\n\nBreaking down ambitious ideas into actionable roadmaps. Skilled at identifying opportunities, designing systems, aligning stakeholders, and creating long-term plans that drive meaningful impact.\n\n\nTeam Leadership\n\nBuilding high-performing teams by fostering collaboration, accountability, and shared ownership. Experienced in leading student communities, organizing volunteers, and creating environments where people can do their best work.\n\n\nProduct Development\n\nTransforming ideas into digital products by combining user needs, technical execution, and iterative problem-solving. Experienced in building web applications, AI-powered platforms, and mobile applications from concept to deployment.\n\n\nPublic Speaking\n\nCommunicating ideas with clarity and confidence through presentations, workshops, and discussions. Comfortable speaking to diverse audiences and translating complex concepts into engaging conversations.\n\n\nStakeholder Management\n\nCollaborating effectively with students, volunteers, mentors, industry professionals, and organizational leaders to align expectations, facilitate communication, and drive collective success`,
        title: 'Expertise'
      }
    ],
    projects: portfolioData.projects.map(proj => ({
      id: `proj-${proj.id}`,
      name: proj.name,
      type: 'project',
      projData: proj
    })),
    contact: [
      {
        id: 'contact-readme',
        name: 'Readme.md',
        type: 'file',
        content: `The best opportunities often start with a conversation. Let's have one.\n\nEmail\n\naaditajay@gmail.com\n\nPhone\n\n+91 95623 21151\n\nLinkedIn\n\nlinkedin.com/in/aaditajay\n\nGitHub\n\ngithub.com/aaditajay\n\nLocation\n\nKerala, India`,
        title: 'Contact Information'
      }
    ],
    desktop: [
      { id: 'about', name: 'About', type: 'folder-link', title: 'About Me' },
      { id: 'experience', name: 'Experience', type: 'folder-link', title: 'Experience' },
      { id: 'expertise', name: 'Expertise', type: 'folder-link', title: 'Expertise' },
      { id: 'projects', name: 'Projects', type: 'folder-link', title: 'Projects' },
      { id: 'contact', name: 'Contact', type: 'folder-link', title: 'Contact' }
    ]
  };

  const getFinderItemIcon = (item) => {
    const nameLower = (item.name || '').toLowerCase();
    const idLower = (item.id || '').toLowerCase();

    // 1. Check for folders / project categories first (folders must have Folder.svg)
    if (item.type === 'folder-link' || item.type === 'project' || item.type === 'folder' || item.id === 'projects') {
      return '/macos/icons/Folder.svg';
    }

    // 2. Check for text/readme documents (specifically readmes and markdown files must have Readme.svg)
    if (nameLower.endsWith('.md') || nameLower === 'readme' || nameLower.endsWith('.txt')) {
      return '/macos/icons/Readme.svg';
    }

    // 3. Check for specific project app logos (placed before fallback/generic .url check)
    if (nameLower === 'being basheer' || nameLower === 'basheer.url' || idLower === 'website-being-basheer') {
      return '/macos/logos/basheer.svg';
    }
    if (nameLower === 'njan aara' || nameLower === 'aara.url' || idLower === 'website-njan-aara') {
      return '/macos/logos/aara.svg';
    }
    if (nameLower === 'the pursuit of hiring' || nameLower === 'tpoh.url' || idLower === 'website-pursuit-of-hiring') {
      return '/macos/logos/tpoh.svg';
    }
    if (nameLower === 'dark netra' || nameLower === 'darknetra.url' || idLower === 'website-dark-netra') {
      return '/macos/logos/darknetra.svg';
    }

    // 4. Check for mulearn link or item (excluding folders and readmes/markdowns which were handled above)
    if (idLower.includes('mulearn') || nameLower.includes('mulearn') || (item.url && item.url.includes('mulearn.org'))) {
      return '/macos/icons/mulearn.svg';
    }

    // 5. Check for Github link or item
    if (idLower.includes('github') || nameLower === 'github' || nameLower.includes('github') || (item.url && item.url.includes('github.com'))) {
      if (idLower.startsWith('github-') || nameLower === 'github.url') {
        return '/macos/logos/GitHub.svg';
      }
      return '/macos/icons/GitHub.svg';
    }

    // 6. Fallback check for other text/readme documents
    if (item.type === 'file' || nameLower.endsWith('.url') || idLower.includes('bio') || idLower.includes('journey') || idLower.includes('vision') || idLower.includes('intern') || idLower.includes('lead') || idLower.includes('vol') || idLower.includes('skill')) {
      return '/macos/icons/Readme.svg';
    }

    // Fallback
    return '/macos/icons/Readme.svg';
  };

  const renderWindowContent = (win) => {
    switch (win.contentType) {
      case 'folder':
        const items = getFolderItems(win.folderKey);
        return (
          <div 
            className="finder-grid-container"
            onClick={() => handleFinderBackgroundClick(win.id)}
            style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}
          >
            <div className="finder-grid" style={{ flexGrow: 1, overflowY: 'auto' }}>
              {items.map(item => {
                const isSelected = selectedItemIds[win.id] === item.id;
                return (
                  <div 
                    key={item.id} 
                    className={`finder-item ${isSelected ? 'selected' : ''}`}
                    onClick={(e) => handleFinderItemClick(e, item, win.id)}
                    onDoubleClick={() => handleFinderItemDoubleClick(item, win.id)}
                  >
                    <div className="finder-item-icon-wrapper">
                      <div className="finder-item-icon">
                        {item.type === 'image' ? (
                          <div style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: '4px', border: '1.2px solid #D1D1D6', background: '#f6f6f6', padding: '1px', boxSizing: 'border-box' }}>
                            <img src={item.url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          </div>
                        ) : (
                          <img src={getFinderItemIcon(item)} alt={item.name} style={{ width: '100%', height: '100%' }} />
                        )}
                      </div>

                    </div>
                    <span className="finder-item-label">
                      <span className="finder-item-label-text">{item.name}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'file':
        if (win.id === 'expertise-readme') {
          const expertiseItems = [
            {
              heading: 'Project Management',
              body: 'Planning, coordinating, and delivering projects from concept to execution. Experienced in managing cross-functional teams, tracking milestones, streamlining workflows, and ensuring successful outcomes through structured execution and Agile methodologies.'
            },
            {
              heading: 'Software Development',
              body: 'Building modern web and mobile applications using technologies such as React, Next.js, Flutter, FastAPI, and Python. Focused on creating scalable, user-centric solutions that solve real-world problems.'
            },
            {
              heading: 'Strategic Thinking',
              body: 'Breaking down ambitious ideas into actionable roadmaps. Skilled at identifying opportunities, designing systems, aligning stakeholders, and creating long-term plans that drive meaningful impact.'
            },
            {
              heading: 'Team Leadership',
              body: 'Building high-performing teams by fostering collaboration, accountability, and shared ownership. Experienced in leading student communities, organizing volunteers, and creating environments where people can do their best work.'
            },
            {
              heading: 'Product Development',
              body: 'Transforming ideas into digital products by combining user needs, technical execution, and iterative problem-solving. Experienced in building web applications, AI-powered platforms, and mobile applications from concept to deployment.'
            },
            {
              heading: 'Public Speaking',
              body: 'Communicating ideas with clarity and confidence through presentations, workshops, and discussions. Comfortable speaking to diverse audiences and translating complex concepts into engaging conversations.'
            },
            {
              heading: 'Stakeholder Management',
              body: 'Collaborating effectively with students, volunteers, mentors, industry professionals, and organizational leaders to align expectations, facilitate communication, and drive collective success'
            }
          ];

          return (
            <div className="text-viewer-body">
              <h3 className="text-viewer-title">{win.fileTitle}</h3>
              <div style={{ marginTop: '12px' }}>
                {expertiseItems.map((item, idx) => (
                  <div key={idx} className="expertise-item" style={{ marginBottom: '16px' }}>
                    <h4 
                      className="expertise-item-heading" 
                      style={{ 
                        fontFamily: 'Gilroy-Medium, var(--font-sans)', 
                        fontSize: '1.05rem', 
                        fontWeight: 600, 
                        color: '#ffffff',
                        marginBottom: '2px'
                      }}
                    >
                      {item.heading}
                    </h4>
                    <p className="expertise-item-body" style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.5' }}>
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        if (['mulearn-foundation-readme', 'mulearn-sbc-readme', 'ieee-sbce-readme', 'purple-movement-readme'].includes(win.id)) {
          const roles = win.fileContent.split(/\n\s*---\s*\n/);
          return (
            <div className="text-viewer-body">
              <h3 className="text-viewer-title">{win.fileTitle}</h3>
              <div style={{ marginTop: '12px' }}>
                {roles.map((roleStr, idx) => {
                  const parts = roleStr.trim().split('\n\n');
                  if (parts.length >= 3) {
                    const title = parts[0].trim();
                    const date = parts[1].trim();
                    const desc = parts.slice(2).join('\n\n').trim();
                    return (
                      <div key={idx} className="experience-role" style={{ marginBottom: idx < roles.length - 1 ? '20px' : '0' }}>
                        <div 
                          style={{ 
                            fontFamily: 'Gilroy-Bold, var(--font-sans)', 
                            fontWeight: 'bold', 
                            fontSize: '1.05rem', 
                            color: '#ffffff', 
                            marginBottom: '2px'
                          }}
                        >
                          {title}
                        </div>
                        <div 
                          style={{ 
                            fontFamily: 'Gilroy-Medium, var(--font-sans)', 
                            fontSize: '0.85rem', 
                            color: '#9ca3af', 
                            marginBottom: '10px' 
                          }}
                        >
                          {date}
                        </div>
                        <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.5', whiteSpace: 'pre-wrap', marginBottom: '12px' }}>
                          {desc}
                        </p>
                        {idx < roles.length - 1 && <hr style={{ border: 'none', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', margin: '14px 0' }} />}
                      </div>
                    );
                  }
                  return <p key={idx} style={{ whiteSpace: 'pre-wrap', marginBottom: '16px' }}>{roleStr}</p>;
                })}
              </div>
            </div>
          );
        }

        if (win.id === 'contact-readme') {
          return (
            <div className="text-viewer-body">
              <h3 className="text-viewer-title">{win.fileTitle}</h3>
              <p className="contact-intro" style={{ marginBottom: '16px', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.5' }}>
                The best opportunities often start with a conversation. Let's have one.
              </p>
              
              <div className="contact-field" style={{ marginBottom: '16px' }}>
                <div className="contact-label" style={{ fontWeight: 600, color: '#9ca3af', fontSize: '0.9rem' }}>Email</div>
                <a href="mailto:aaditajay@gmail.com" className="contact-link" style={{ color: '#007aff', textDecoration: 'underline', fontSize: '0.95rem' }}>
                  aaditajay@gmail.com
                </a>
              </div>
              
              <div className="contact-field" style={{ marginBottom: '16px' }}>
                <div className="contact-label" style={{ fontWeight: 600, color: '#9ca3af', fontSize: '0.9rem' }}>Phone</div>
                <a href="tel:+919562321151" className="contact-link" style={{ color: '#007aff', textDecoration: 'underline', fontSize: '0.95rem' }}>
                  +91 95623 21151
                </a>
              </div>
              
              <div className="contact-field" style={{ marginBottom: '16px' }}>
                <div className="contact-label" style={{ fontWeight: 600, color: '#9ca3af', fontSize: '0.9rem' }}>LinkedIn</div>
                <a href="https://linkedin.com/in/aaditajay" target="_blank" rel="noreferrer" className="contact-link" style={{ color: '#007aff', textDecoration: 'underline', fontSize: '0.95rem' }}>
                  linkedin.com/in/aaditajay
                </a>
              </div>
              
              <div className="contact-field" style={{ marginBottom: '16px' }}>
                <div className="contact-label" style={{ fontWeight: 600, color: '#9ca3af', fontSize: '0.9rem' }}>GitHub</div>
                <a href="https://github.com/aaditajay" target="_blank" rel="noreferrer" className="contact-link" style={{ color: '#007aff', textDecoration: 'underline', fontSize: '0.95rem' }}>
                  github.com/aaditajay
                </a>
              </div>
              
              <div className="contact-field" style={{ marginBottom: '16px' }}>
                <div className="contact-label" style={{ fontWeight: 600, color: '#9ca3af', fontSize: '0.9rem' }}>Location</div>
                <div className="contact-value" style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>Kerala, India</div>
              </div>
            </div>
          );
        }

        return (
          <div className="text-viewer-body">
            <h3 className="text-viewer-title">{win.fileTitle}</h3>
            <p style={{ whiteSpace: 'pre-wrap' }}>{win.fileContent}</p>
          </div>
        );

      case 'project':
        const proj = win.projData;
        return (
          <div className="readme-container">
            <div className="readme-header">
              <h2 className="readme-title">{proj.name}</h2>
              <p className="readme-tagline">{proj.tagline}</p>
              <div className="readme-tech-tags">
                {proj.techStack.map((tech, idx) => (
                  <span key={idx} className="readme-tech-tag">{tech}</span>
                ))}
              </div>
            </div>

            {proj.description ? (
              <div className="readme-section" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#e5e7eb', fontSize: '0.95rem' }}>
                {proj.description}
              </div>
            ) : (
              <>
                <div className="readme-section">
                  <h4 className="readme-section-title">Problem</h4>
                  <p>{proj.problem}</p>
                </div>

                <div className="readme-section">
                  <h4 className="readme-section-title">Solution</h4>
                  <p>{proj.solution}</p>
                </div>

                <div className="readme-section">
                  <h4 className="readme-section-title">Impact & Metrics</h4>
                  <p style={{color: '#10b981', fontWeight: 600}}>{proj.impact}</p>
                </div>

                <div className="readme-section">
                  <h4 className="readme-section-title">Key Learnings</h4>
                  <p>{proj.learnings}</p>
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              {proj.website && (
                <a href={proj.website} target="_blank" rel="noreferrer" className="readme-btn-link">
                  Visit Website
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: 6}}>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              )}
              {proj.github && (
                <a href={proj.github} target="_blank" rel="noreferrer" className="readme-btn-link" style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                  View GitHub
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: 6}}>
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </a>
              )}
            </div>
          </div>
        );

      case 'image':
        return (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1e1e1e', boxSizing: 'border-box' }}>
            <img src={win.imageUrl} alt={win.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          </div>
        );

      case 'pdf':
        return (
          <iframe 
            src={win.pdfUrl} 
            style={{ width: '100%', height: '100%', border: 'none', background: '#ffffff' }} 
            title={win.title}
          />
        );

      default:
        return <div>Unknown layout.</div>;
    }
  };

  const handleFinderItemDoubleClick = (item, winId) => {
    if (item.type === 'file') {
      openWindow({
        id: item.id,
        appName: 'TextEdit',
        title: `${item.name} - TextEdit`,
        contentType: 'file',
        fileTitle: item.title,
        fileContent: item.content,
        w: 680,
        h: 480
      });
    } else if (item.type === 'link') {
      if (item.url.startsWith('mailto:')) {
        window.location.href = item.url;
      } else {
        window.open(item.url, '_blank');
      }
    } else if (item.type === 'project') {
      // Navigate Finder in-place to project folder
      navigateFinder(winId, `project-folder-${item.projData.id}`, item.name);
    } else if (item.type === 'folder-link') {
      navigateFinder(winId, item.folderKey || item.id, item.title || item.name);
    } else if (item.type === 'image') {
      openWindow({
        id: item.id,
        appName: 'Preview',
        title: item.name,
        contentType: 'image',
        imageUrl: item.url,
        w: 550,
        h: 400
      });
    }
  };

  const handleFolderClick = (id, title) => {
    openWindow({
      id: id,
      appName: 'Finder',
      title: title,
      contentType: 'folder',
      folderKey: id,
      w: 780,
      h: 460
    });
  };

  const handleAppClick = (appId) => {
    if (appId === 'finder') {
      openWindow({
        id: 'finder',
        appName: 'Finder',
        title: 'Desktop',
        contentType: 'folder',
        folderKey: 'desktop',
        w: 780,
        h: 460
      });
      return;
    }

    const clickedApp = dockApps.find(app => app.id === appId);
    if (clickedApp && clickedApp.url) {
      window.open(clickedApp.url, '_blank');
      return;
    }

    if (appId === 'resume') {
      window.open(portfolioData.profile.resumeUrl, '_blank');
      return;
    }

    const titleMap = {
      about: 'About Me',
      expertise: 'Expertise',
      experience: 'Experience',
      projects: 'Projects',
      contact: 'Contact'
    };

    handleFolderClick(appId, titleMap[appId] || appId);
  };

  // Base list of desktop folder icons
  const desktopFolders = [
    { id: 'about', title: 'About' },
    { id: 'expertise', title: 'Expertise' },
    { id: 'experience', title: 'Experience' },
    { id: 'projects', title: 'Projects' },
    { id: 'contact', title: 'Contact' },
    { id: 'resume', title: 'Resume', isFile: true, icon: '/macos/icons/resume.png' }
  ];

  // Dock items configuration
  const dockApps = [
    { id: 'finder', name: 'Finder', icon: '/macos/icons/Finder.svg' },
    { id: 'claude', name: 'Claude', icon: '/macos/icons/Claude.png', url: 'https://claude.ai/' },
    { id: 'figma', name: 'Figma', icon: '/macos/icons/Figma.png', url: 'https://www.figma.com/' },
    { id: 'vscode', name: 'VSCode', icon: '/macos/icons/VSCode.png', url: 'https://code.visualstudio.com/' },
    { id: 'letterboxd', name: 'Letterboxd', icon: '/macos/icons/Letterboxd.png', url: 'https://letterboxd.com/' },
    { id: 'pinterest', name: 'Pinterest', icon: '/macos/icons/Pinterest.png', url: 'https://www.pinterest.com/' },
    { id: 'spotify', name: 'Spotify', icon: '/macos/icons/Spotify.png', url: 'https://www.spotify.com/' },
    { id: 'notion', name: 'Notion', icon: '/macos/icons/Notion.png', url: 'https://www.notion.so/' },
    { id: 'obsidian', name: 'Obsidian', icon: '/macos/icons/Obsidian.png', url: 'https://obsidian.md/' }
  ];

  // Get currently running app IDs (any open windows)
  const openAppIds = openWindows.filter(w => !w.isMinimized).map(w => w.id);

  const handleMenuAction = (action) => {
    if (action === 'about') {
      handleFolderClick('about', 'About Me');
    } else if (action === 'preferences' || action === 'logout' || action === 'lock' || action === 'shutdown' || action === 'restart') {
      onExit();
    } else if (action === 'contact-support') {
      handleFolderClick('contact', 'Contact');
    }
  };

  return (
    <div className="macos-container">
      {/* Top Menu Bar */}
      <MacOSMenuBar 
        appName={activeAppName} 
        onMenuAction={handleMenuAction}
      />

      {/* Battery Percentage Widget (Top-Left) */}
      {/* Battery Percentage Widget (Top-Left) */}
      <div 
        className="battery-widget" 
        style={{ 
          position: 'absolute', 
          top: '52px', 
          left: '24px', 
          width: '140px', 
          height: '140px', 
          padding: '16px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'flex-start', 
          justifyContent: 'space-between', 
          boxSizing: 'border-box', 
          border: '1.2px solid rgba(255, 255, 255, 0.25)', 
          borderRadius: '28px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
          zIndex: 5
        }}
      >
        {/* Backdrop Filter Layer */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.1) 100%)',
            backdropFilter: 'url("#container-glass") blur(20px)',
            WebkitBackdropFilter: 'url("#container-glass") blur(20px)',
            zIndex: -1,
            pointerEvents: 'none'
          }}
        />
        {/* Progress Circle & Icon */}
        <svg width="48" height="48" viewBox="0 0 60 60" style={{ display: 'block', position: 'relative', zIndex: 10, margin: '-2px 0 0 -2px' }}>
          {/* Background circle */}
          <circle cx="30" cy="30" r="24" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="4.5" />
          {/* Green battery circle representing 73% progress */}
          <circle 
            cx="30" 
            cy="30" 
            r="24" 
            fill="none" 
            stroke="#30d158" 
            strokeWidth="4.5" 
            strokeDasharray="150.8" 
            strokeDashoffset="40.7" 
            strokeLinecap="round" 
            transform="rotate(-90 30 30)" 
          />
          {/* Laptop outline vector inside circle */}
          <path 
            d="M23 21h14a2 2 0 0 1 2 2v8a1 1 0 0 1-1 1H22a1 1 0 0 1-1-1v-8a2 2 0 0 1 2-2zm-6 12h26" 
            stroke="#ffffff" 
            strokeWidth="1.8" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
        <span style={{ margin: 0, zIndex: 10, color: '#ffffff', fontSize: '2.2rem', fontWeight: '500', lineHeight: 1, fontFamily: 'var(--font-sans)' }}>73%</span>
      </div>

      {/* Horizontal Folders Grid (Centered Upper Desktop) */}
      <div className="desktop-folders-row">
        {desktopFolders.map(folder => (
          <div 
            key={folder.id}
            className="desktop-folder-item"
            onDoubleClick={() => {
              if (folder.isFile) {
                openWindow({
                  id: folder.id,
                  appName: 'Preview',
                  title: `${folder.title}.pdf`,
                  contentType: 'pdf',
                  pdfUrl: '/assets/resume.pdf',
                  w: 800,
                  h: 600
                });
              } else {
                handleFolderClick(folder.id, folder.title === 'About' ? 'About Me' : folder.title);
              }
            }}
          >
            <div className="desktop-folder-icon">
              <img src={folder.icon || "/macos/icons/Folder.svg"} alt={folder.title} style={{ width: '100%', height: '100%' }} />
            </div>
            <span className="desktop-folder-label">{folder.title}</span>
          </div>
        ))}
      </div>

      {/* Main Desktop Workspace Area */}
      <div style={{ flexGrow: 1, position: 'relative', width: '100%' }}>
        {openWindows.map(win => {
          const isFocused = windowOrder[windowOrder.length - 1] === win.id;
          const zIndex = windowOrder.indexOf(win.id) + 100;
          
          return (            <div
              key={win.id}
              className={`mac-window ${win.appName === 'Finder' ? 'finder-window' : ''} ${isFocused ? 'active' : ''} ${win.isMinimized ? 'minimized' : ''}`}
              style={{
                top: win.isMaximized ? '28px' : `${win.y}px`,
                left: win.isMaximized ? '0' : `${win.x}px`,
                width: win.isMaximized ? '100vw' : `${win.w}px`,
                height: win.isMaximized ? 'calc(100vh - 28px)' : `${win.h}px`,
                zIndex: zIndex
              }}
              onMouseDown={() => focusWindow(win.id)}
            >
              {win.appName === 'Finder' ? (
                <div className="finder-window-container">
                  <div 
                    className="finder-sidebar"
                    style={{
                      width: `${sidebarWidth}px`,
                      minWidth: `${sidebarWidth}px`,
                      maxWidth: `${sidebarWidth}px`
                    }}
                  >
                    <div 
                      className={`sidebar-resize-handle ${isResizingSidebar ? 'resizing' : ''}`}
                      onMouseDown={startSidebarResize}
                    />
                    <div 
                      className="finder-sidebar-header"
                      onMouseDown={(e) => {
                        if (!win.isMaximized) {
                          startDrag(win.id, e);
                        }
                      }}
                    >
                      <div className="window-traffic-lights" style={{ display: 'flex', gap: '8px' }}>
                        <button className="traffic-dot close" onClick={(e) => closeWindow(win.id, e)} />
                        <button className="traffic-dot minimize" onClick={(e) => toggleMinimize(win.id, e)} />
                        <button className="traffic-dot zoom" onClick={(e) => toggleMaximize(win.id, e)} />
                      </div>
                    </div>
                    <div className="finder-sidebar-content">
                      {renderTreeSidebar(win)}
                    </div>
                  </div>

                  {/* Split Main pane */}
                  <div className="finder-main">
                    {/* Toolbar */}
                    <div 
                      className="finder-toolbar"
                      onMouseDown={(e) => {
                        if (!win.isMaximized && !e.target.closest('button') && !e.target.closest('input')) {
                          startDrag(win.id, e);
                        }
                      }}
                    >
                      <div className="finder-toolbar-left">
                        <div className="finder-toolbar-nav">
                          <button 
                            className="finder-toolbar-nav-btn" 
                            onClick={() => handleBackClick(win)}
                            disabled={!win.history || win.historyIndex <= 0}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                          </button>
                          <button 
                            className="finder-toolbar-nav-btn" 
                            onClick={() => handleForwardClick(win)}
                            disabled={!win.history || win.historyIndex >= win.history.length - 1}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                          </button>
                        </div>
                        <div className="finder-toolbar-title">{win.title}</div>
                      </div>



                      <div className="finder-toolbar-right" style={{ display: 'flex', alignItems: 'center', paddingRight: '8px' }}>
                        <img src="/macos/icons/Header.svg" alt="Toolbar controls" style={{ height: '28px', objectFit: 'contain', pointerEvents: 'none', userSelect: 'none' }} />
                      </div>
                    </div>

                    {/* Window Content */}
                    <div className="finder-content-body finder-window-content-light">
                      {renderWindowContent(win)}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div 
                    className="mac-window-titlebar"
                    onMouseDown={(e) => {
                      if (!win.isMaximized) {
                        startDrag(win.id, e);
                      }
                    }}
                  >
                    <div className="window-traffic-lights">
                      <button className="traffic-dot close" onClick={(e) => closeWindow(win.id, e)} />
                      <button className="traffic-dot minimize" onClick={(e) => toggleMinimize(win.id, e)} />
                      <button className="traffic-dot zoom" onClick={(e) => toggleMaximize(win.id, e)} />
                    </div>
                    <span className="window-title-text">{win.title}</span>
                  </div>

                  <div className="mac-window-content" style={win.contentType === 'pdf' || win.contentType === 'image' ? { padding: 0, overflow: 'hidden' } : {}}>
                    {renderWindowContent(win)}
                  </div>
                </>
              )}
              {/* Universal Window Resize Handle */}
              {!win.isMaximized && (
                <div 
                  className="window-resize-handle"
                  onMouseDown={(e) => startResize(win.id, e)}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Floating macOS Dock */}
      <div className="mac-dock-container">
        <MacOSDock 
          apps={dockApps} 
          onAppClick={handleAppClick} 
          openApps={openAppIds}
        />
      </div>
      <GlassFilter />
    </div>
  );
}
