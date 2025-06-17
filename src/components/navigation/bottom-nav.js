import { HiHeart, HiUser } from 'react-icons/hi';

export function BottomNavigation({ activeTab, onTabChange }) {
  const tabs = [
    {
      id: 'matching',
      icon: HiHeart,
    },
    {
      id: 'profile', 
      icon: HiUser,
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white px-4 py-2 safe-area-pb">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center justify-center p-3 rounded-lg transition-colors ${
                isActive 
                  ? 'text-[#AA54EA] bg-purple-50' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="text-xl" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
