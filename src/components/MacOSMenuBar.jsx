import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Laptop, 
  Settings, 
  Clock, 
  XSquare, 
  Moon, 
  RotateCw, 
  Power, 
  Lock, 
  LogOut 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ControlCenterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
    <line x1="4" y1="8" x2="20" y2="8" />
    <circle cx="8" cy="8" r="2.5" fill="currentColor" stroke="none" />
    <line x1="4" y1="16" x2="20" y2="16" />
    <circle cx="16" cy="16" r="2.5" fill="currentColor" stroke="none" />
  </svg>
);

const LockIcon = () => <Lock size={13} strokeWidth={2.2} style={{ opacity: 0.9 }} />;

const PlayIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.9 }}>
    <path d="M8 5v14l11-7z" />
  </svg>
);

const MoonIcon = () => <Moon size={13} strokeWidth={2.2} style={{ opacity: 0.9 }} />;

const SearchIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const SiriIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" />
    <path d="M12 4a8 8 0 0 0-8 8" />
  </svg>
);

const BatteryIcon = () => (
  <svg width="22" height="11" viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.9, display: 'inline-block', verticalAlign: 'middle' }}>
    <rect x="1" y="1" width="20" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M22 4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <rect x="3" y="3" width="13" height="6" rx="1" fill="currentColor" stroke="none" />
  </svg>
);

const AppStoreIcon = ({ className, style, size = 14 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    className={className} 
    style={style}
  >
    <line x1="12" y1="4" x2="19" y2="18" />
    <line x1="20" y1="17" x2="4" y2="17" />
    <line x1="5" y1="18" x2="12" y2="4" />
  </svg>
);

const renderItemIcon = (iconName) => {
  const iconProps = {
    size: 14,
    strokeWidth: 2.2,
    className: "menu-item-icon",
    style: { marginRight: '8px', flexShrink: 0 }
  };

  switch (iconName) {
    case 'laptop':
      return <Laptop {...iconProps} />;
    case 'settings':
      return <Settings {...iconProps} />;
    case 'app-store':
      return <AppStoreIcon {...iconProps} />;
    case 'recent':
      return <Clock {...iconProps} />;
    case 'force-quit':
      return <XSquare {...iconProps} />;
    case 'sleep':
      return <Moon {...iconProps} />;
    case 'restart':
      return <RotateCw {...iconProps} />;
    case 'shutdown':
      return <Power {...iconProps} />;
    case 'lock':
      return <Lock {...iconProps} />;
    case 'logout':
      return <LogOut {...iconProps} />;
    default:
      return null;
  }
};

// Default Finder menus
const DEFAULT_MENUS = [
  {
    label: 'File',
    items: [
      { label: 'New Tab', action: 'new-tab', shortcut: '⌘T' },
      { label: 'New Window', action: 'new-window', shortcut: '⌘N' },
      { label: 'New Private Window', action: 'new-private', shortcut: '⇧⌘N' },
      { type: 'separator' },
      { label: 'Open File...', action: 'open-file', shortcut: '⌘O' },
      { label: 'Open Location...', action: 'open-location', shortcut: '⌘L' },
      { type: 'separator' },
      { label: 'Close Window', action: 'close-window', shortcut: '⇧⌘W' },
      { label: 'Close Tab', action: 'close-tab', shortcut: '⌘W' },
      { label: 'Save Page As...', action: 'save-page', shortcut: '⌘S' },
      { type: 'separator' },
      { label: 'Share', action: 'share', hasSubmenu: true },
      { type: 'separator' },
      { label: 'Print...', action: 'print', shortcut: '⌘P' },
    ],
  },
  {
    label: 'Edit',
    items: [
      { label: 'Undo', action: 'undo', shortcut: '⌘Z' },
      { label: 'Redo', action: 'redo', shortcut: '⇧⌘Z' },
      { type: 'separator' },
      { label: 'Cut', action: 'cut', shortcut: '⌘X' },
      { label: 'Copy', action: 'copy', shortcut: '⌘C' },
      { label: 'Paste', action: 'paste', shortcut: '⌘V' },
      { label: 'Select All', action: 'select-all', shortcut: '⌘A' },
      { type: 'separator' },
      { label: 'Find', action: 'find', shortcut: '⌘F' },
      { label: 'Find Next', action: 'find-next', shortcut: '⌘G' },
      { label: 'Find Previous', action: 'find-prev', shortcut: '⇧⌘G' },
      { type: 'separator' },
      { label: 'Emoji & Symbols', action: 'emoji', shortcut: '⌃⌘␣' },
    ],
  },
  {
    label: 'View',
    items: [
      { label: 'as Icons', action: 'view-icons', shortcut: '⌘1' },
      { label: 'as List', action: 'view-list', shortcut: '⌘2' },
      { label: 'as Columns', action: 'view-columns', shortcut: '⌘3' },
      { label: 'as Gallery', action: 'view-gallery', shortcut: '⌘4' },
      { type: 'separator' },
      { label: 'Use Stacks', action: 'use-stacks', shortcut: '⌃⌘0' },
      { label: 'Sort By', action: 'sort-by', hasSubmenu: true },
      { type: 'separator' },
      { label: 'Hide Sidebar', action: 'hide-sidebar', shortcut: '⌥⌘S' },
      { label: 'Show Preview', action: 'show-preview', shortcut: '⇧⌘P' },
      { type: 'separator' },
      { label: 'Enter Full Screen', action: 'fullscreen', shortcut: '⌃⌘F' },
    ],
  },
  {
    label: 'Go',
    items: [
      { label: 'Back', action: 'go-back', shortcut: '⌘[' },
      { label: 'Forward', action: 'go-forward', shortcut: '⌘]' },
      { label: 'Enclosing Folder', action: 'go-enclosing', shortcut: '⌘↑' },
      { type: 'separator' },
      { label: 'Recents', action: 'go-recents', shortcut: '⇧⌘F' },
      { label: 'Documents', action: 'go-documents', shortcut: '⇧⌘O' },
      { label: 'Desktop', action: 'go-desktop', shortcut: '⇧⌘D' },
      { label: 'Downloads', action: 'go-downloads', shortcut: '⌥⌘L' },
      { label: 'Home', action: 'go-home', shortcut: '⇧⌘H' },
      { label: 'Computer', action: 'go-computer', shortcut: '⇧⌘C' },
      { label: 'Network', action: 'go-network', shortcut: '⇧⌘K' },
      { label: 'iCloud Drive', action: 'go-icloud', shortcut: '⇧⌘I' },
      { label: 'Applications', action: 'go-apps', shortcut: '⇧⌘A' },
      { label: 'Utilities', action: 'go-utilities', shortcut: '⇧⌘U' },
      { type: 'separator' },
      { label: 'Go to Folder...', action: 'go-to-folder', shortcut: '⇧⌘G' },
      { label: 'Connect to Server...', action: 'go-connect', shortcut: '⌘K' },
    ],
  },
  {
    label: 'Window',
    items: [
      { label: 'Minimize', action: 'minimize', shortcut: '⌘M' },
      { label: 'Zoom', action: 'zoom' },
      { type: 'separator' },
      { label: 'Cycle Through Windows', action: 'cycle-windows', shortcut: '⌘`' },
      { type: 'separator' },
      { label: 'Bring All to Front', action: 'bring-to-front' },
    ],
  },
  {
    label: 'Help',
    items: [
      { label: 'Search', action: 'search-help' },
      { type: 'separator' },
      { label: 'App Help', action: 'app-help' },
      { label: 'Keyboard Shortcuts', action: 'shortcuts' },
      { type: 'separator' },
      { label: 'Contact Support', action: 'contact-support' },
    ],
  },
];

// Apple menu items
const APPLE_MENU_ITEMS = [
  { label: 'About This Mac', action: 'about', icon: 'laptop' },
  { type: 'separator' },
  { label: 'System Settings...', action: 'preferences', icon: 'settings' },
  { label: 'App Store', action: 'app-store', icon: 'app-store' },
  { type: 'separator' },
  { label: 'Recent Items', action: 'recent', hasSubmenu: true, icon: 'recent' },
  { type: 'separator' },
  { label: 'Force Quit Finder', action: 'force-quit', shortcut: '⌥⇧⌘⎋', icon: 'force-quit' },
  { type: 'separator' },
  { label: 'Sleep', action: 'sleep', icon: 'sleep' },
  { label: 'Restart...', action: 'restart', icon: 'restart' },
  { label: 'Shut Down...', action: 'shutdown', icon: 'shutdown' },
  { type: 'separator' },
  { label: 'Lock Screen', action: 'lock', shortcut: '⌃⌘Q', icon: 'lock' },
  { label: 'Log Out Aadit Ajay...', action: 'logout', shortcut: '⇧⌘Q', icon: 'logout' },
];

const MenuDropdown = ({ isOpen, onClose, items, position, onAction }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          className="mac-menu-dropdown"
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.16, ease: [0.25, 1, 0.5, 1] }}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`
          }}
        >
          <div className="mac-menu-dropdown-inner">
            {items.map((item, index) => {
              if (item.type === 'separator') {
                return (
                  <div
                    key={index}
                    className="mac-menu-separator"
                  />
                );
              }

              return (
                <div
                  key={index}
                  className="mac-menu-dropdown-item"
                  onClick={() => {
                    if (item.action) {
                      onAction?.(item.action);
                    }
                    onClose();
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    {item.icon && renderItemIcon(item.icon)}
                    <span>{item.label}</span>
                  </span>
                  
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {item.shortcut && (
                      <span className="mac-shortcut">
                        {item.shortcut}
                      </span>
                    )}
                    {item.hasSubmenu && (
                      <span className="mac-arrow">
                        ▶
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MacOSMenuBar = ({
  appName = 'Finder',
  menus = DEFAULT_MENUS,
  onMenuAction,
  className = ''
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });

  const appleLogoRef = useRef(null);
  const menuRefs = useRef({});

  // Update clock dynamically matching reference format
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = days[now.getDay()];
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthName = months[now.getMonth()];
      
      const dayOfMonth = now.getDate();
      
      const timeString = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
      setCurrentTime(`${dayName} ${monthName} ${dayOfMonth} ${timeString}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAppleMenuClick = useCallback(() => {
    if (activeMenu === 'apple') {
      setActiveMenu(null);
    } else {
      if (appleLogoRef.current) {
        const rect = appleLogoRef.current.getBoundingClientRect();
        const parentRect = appleLogoRef.current.offsetParent?.getBoundingClientRect() || { left: 0, top: 0 };
        setDropdownPosition({
          x: rect.left - parentRect.left,
          y: 28 // Menu bar height
        });
      }
      setActiveMenu('apple');
    }
  }, [activeMenu]);

  const handleMenuItemClick = useCallback((menuLabel) => {
    if (activeMenu === menuLabel) {
      setActiveMenu(null);
    } else {
      const menuRef = menuRefs.current[menuLabel];
      if (menuRef) {
        const rect = menuRef.getBoundingClientRect();
        const parentRect = menuRef.offsetParent?.getBoundingClientRect() || { left: 0, top: 0 };
        setDropdownPosition({
          x: rect.left - parentRect.left,
          y: 28 // Menu bar height
        });
        setActiveMenu(menuLabel);
      }
    }
  }, [activeMenu]);

  const closeDropdown = useCallback(() => {
    setActiveMenu(null);
  }, []);

  const handleMenuAction = useCallback((action) => {
    onMenuAction?.(action);
  }, [onMenuAction]);

  return (
    <div style={{ position: 'relative', width: '100%', zIndex: 9999 }}>
      <div
        className={`mac-menubar ${className}`}
        style={{
          height: '28px',
          background: 'transparent',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          borderBottom: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 16px',
          fontSize: '13px',
          color: '#fff',
          fontFamily: 'var(--font-sans)',
          fontWeight: 500,
          boxShadow: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          {/* Apple Logo */}
          <div
            ref={appleLogoRef}
            onClick={handleAppleMenuClick}
            style={{ 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              padding: '2px 4px',
              borderRadius: '4px'
            }}
          >
            <svg
              width="14"
              height="16"
              viewBox="0 0 110 140"
              fill="white"
              style={{ display: 'block' }}
            >
              <path d="M0 0 C5.58236403 2.09904125 9.60467483 0.88914551 14.97265625 -1.09375 C24.52115711 -4.439908 34.11309717 -4.54862597 43.35546875 -0.23046875 C48.12396107 2.4076135 50.86575425 5.08527779 53.41015625 9.90625 C52.35828125 10.69 51.30640625 11.47375 50.22265625 12.28125 C44.71078889 17.03285979 41.56508326 23.28635633 40.47265625 30.46875 C40.03168138 38.29605399 41.87292643 44.10920342 46.82421875 50.18359375 C49.69950343 53.3067478 52.89615914 55.56358526 56.41015625 57.90625 C53.62981681 69.36905295 47.16852412 82.51930379 37.16015625 89.40625 C32.57853571 91.90531575 28.55304343 92.53884155 23.41015625 91.90625 C21.37403354 91.28785199 19.35323208 90.61750058 17.34765625 89.90625 C8.57237805 86.84256185 3.23794872 88.20952158 -5.43359375 91.00390625 C-10.61364364 92.48483636 -14.47478385 92.64004629 -19.65234375 90.84375 C-33.68747534 81.58653555 -41.78781841 64.33028781 -45.19067383 48.33569336 C-47.46721739 34.48010623 -46.65131557 19.75938694 -38.46484375 8.03125 C-28.23499655 -4.14713952 -14.17528672 -5.71090688 0 0 Z" transform="translate(45.58984375,33.09375)" />
              <path d="M0 0 C0.57231958 7.72631433 -0.96546021 14.10973315 -5.80078125 20.30859375 C-10.93255592 25.73930675 -15.29387058 28.82351765 -22.9375 29.1875 C-23.948125 29.125625 -24.95875 29.06375 -26 29 C-26.59493662 20.81962143 -24.35167303 14.76774508 -19.375 8.25 C-14.46051828 2.89895264 -7.38077314 -0.97115436 0 0 Z" transform="translate(76,0)" />
            </svg>
          </div>

          {/* Current App Name */}
          <span style={{ fontWeight: 600 }}>
            {appName}
          </span>

          {/* Menu Items */}
          <div style={{ display: 'flex', gap: '16px' }}>
            {menus.map((menu) => (
              <span
                key={menu.label}
                ref={(el) => { menuRefs.current[menu.label] = el; }}
                style={{ cursor: 'pointer', padding: '2px 4px' }}
                onClick={() => handleMenuItemClick(menu.label)}
              >
                {menu.label}
              </span>
            ))}
          </div>
        </div>

        {/* Right section - status icons and clock matching reference image */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', opacity: 0.9 }}>A</span>
          <MoonIcon />
          <LockIcon />
          <PlayIcon />
          
          {/* WiFi */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg width="18" height="12" viewBox="0 0 150 110" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0 C0.65500488 0.20898926 1.31000977 0.41797852 1.98486328 0.63330078 C14.82324128 4.91062412 25.79730909 11.812883 35.8125 20.8125 C36.57759888 21.49638794 36.57759888 21.49638794 37.3581543 22.1940918 C39.29498348 24.01298915 40.84104556 25.67845094 42.0234375 28.0703125 C41.98868831 30.93132924 40.7368247 32.00327419 38.8125 34.0625 C38.20019531 34.73410156 37.58789062 35.40570313 36.95703125 36.09765625 C33.07626002 39.86998278 33.07626002 39.86998278 31 41 C26.85231569 40.06955581 24.51783886 37.81497315 21.5625 34.875 C4.56703863 19.28329355 -16.81223148 15.07788117 -39.23388672 15.82958984 C-58.92928161 17.04295133 -76.63301992 28.19464819 -91 41 C-96.17940014 39.58743632 -99.965861 36.34834456 -103 32 C-103.39867702 28.27901445 -102.98432718 26.38320487 -100.8046875 23.3203125 C-76.41780756 -3.27241587 -33.31208663 -10.63151701 0 0 Z" fill="#FFFFFF" transform="translate(103,4)"/>
              <path d="M0 0 C1.8984375 2.05078125 1.8984375 2.05078125 2.8984375 5.05078125 C0.89685511 7.9957076 -1.65789629 10.46703226 -4.1015625 13.05078125 C-5.1534375 14.31921875 -5.1534375 14.31921875 -6.2265625 15.61328125 C-8.1015625 17.05078125 -8.1015625 17.05078125 -10.4609375 16.84375 C-13.41993192 15.95517623 -14.91300535 14.82404416 -17.2265625 12.80078125 C-27.98918153 4.03925219 -39.5915468 1.83255625 -53.1015625 3.05078125 C-61.85246663 4.93211813 -69.21440161 9.60534319 -75.8515625 15.48828125 C-78.1015625 17.05078125 -78.1015625 17.05078125 -80.44140625 16.9140625 C-83.77758701 15.83139591 -85.4436323 14.27530835 -87.9140625 11.80078125 C-88.70425781 11.0325 -89.49445313 10.26421875 -90.30859375 9.47265625 C-92.1015625 7.05078125 -92.1015625 7.05078125 -92.62109375 4.52734375 C-91.49952622 -0.81907591 -86.29726382 -3.87482782 -82.1015625 -6.94921875 C-74.21821198 -11.66652861 -66.12451308 -15.1700454 -57.1015625 -16.94921875 C-56.39128906 -17.09101562 -55.68101563 -17.2328125 -54.94921875 -17.37890625 C-34.50294745 -20.50105568 -14.99849748 -13.69736599 0 0 Z" fill="#FFFFFF" transform="translate(117.1015625,53.94921875)"/>
              <path d="M0 0 C2.55892967 1.51276457 3.9662918 2.74643145 6 5 C6.5234375 7.25390625 6.5234375 7.25390625 6 10 C4.23657597 12.43682265 2.11984755 14.43955796 -0.0625 16.5 C-0.62388672 17.05558594 -1.18527344 17.61117187 -1.76367188 18.18359375 C-5.58232446 21.89314197 -9.39060132 25.31429256 -14 28 C-19.80211565 26.44161162 -23.60213327 22.18619112 -27.875 18.1875 C-28.67164063 17.47529297 -29.46828125 16.76308594 -30.2890625 16.02929688 C-31.03671875 15.33255859 -31.784375 14.63582031 -32.5546875 13.91796875 C-33.24030762 13.28656982 -33.92592773 12.6551709 -34.63232422 12.00463867 C-36 10 -36 10 -35.83251953 7.4152832 C-34.58453344 3.79465962 -33.03776765 2.36945876 -30 0 C-18.999621 -5.30221711 -11.00576064 -5.15947378 0 0 Z" fill="#FFFFFF" transform="translate(87,77)"/>
            </svg>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '12.5px', opacity: 0.9 }}>73%</span>
            <BatteryIcon />
          </div>

          <ControlCenterIcon />
          <SearchIcon />
          <SiriIcon />

          {/* Clock */}
          <span style={{ cursor: 'pointer', padding: '2px 4px' }}>
            {currentTime}
          </span>
        </div>
      </div>

      {/* Apple Menu Dropdown */}
      <MenuDropdown
        isOpen={activeMenu === 'apple'}
        onClose={closeDropdown}
        items={APPLE_MENU_ITEMS}
        position={dropdownPosition}
        onAction={handleMenuAction}
      />

      {/* Menu Dropdowns */}
      {menus.map((menu) => (
        <MenuDropdown
          key={menu.label}
          isOpen={activeMenu === menu.label}
          onClose={closeDropdown}
          items={menu.items}
          position={dropdownPosition}
          onAction={handleMenuAction}
        />
      ))}
    </div>
  );
};

export default MacOSMenuBar;
