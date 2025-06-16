import { HiHeart, HiUser } from 'react-icons/hi';

export function BottomNavigation({ activeTab, onTabChange }) {
  const tabs = [
    {
      id: 'matching',
      icon: HiHeart,
      label: 'Matching'
    },
    {
      id: 'profile', 
      icon: HiUser,
      label: 'Profilo'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                isActive 
                  ? 'text-[#AA54EA]' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className={`text-2xl mb-1 ${isActive ? 'text-[#AA54EA]' : ''}`} />
              <span className="text-xs font-medium">{tab.label}</span>
              {isActive && (
                <div className="w-1 h-1 bg-[#AA54EA] rounded-full mt-1"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
