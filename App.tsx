
import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Sparkles, Settings, Copy, Check, HelpCircle, X, List, Github } from 'lucide-react';
import { DEFAULT_QUOTES } from './constants';
import { Quote, Theme } from './types';
import { generateAIQuote } from './geminiService';

const App: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote>(DEFAULT_QUOTES[0]);
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showList, setShowList] = useState(false);

  const nextRandomQuote = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * DEFAULT_QUOTES.length);
      setCurrentQuote(DEFAULT_QUOTES[randomIndex]);
      setIsAnimating(false);
    }, 300);
  }, []);

  const fetchAIQuote = async () => {
    setIsLoadingAI(true);
    const newQuote = await generateAIQuote();
    if (newQuote) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuote(newQuote);
        setIsAnimating(false);
      }, 300);
    }
    setIsLoadingAI(false);
  };

  useEffect(() => {
    nextRandomQuote();
  }, [nextRandomQuote]);

  const themeClasses = {
    [Theme.LIGHT]: "bg-white text-gray-800 border-gray-200",
    [Theme.DARK]: "bg-[#191919] text-gray-100 border-gray-700",
    [Theme.NOTION]: "bg-[#F7F6F3] text-gray-800 border-gray-200"
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-2 transition-colors duration-500 ${theme === Theme.DARK ? 'bg-[#121212]' : 'bg-transparent'}`}>
      <div 
        className={`relative w-full max-w-md p-6 sm:p-8 rounded-xl border shadow-sm transition-all duration-300 ${themeClasses[theme]} ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
      >
        <div className="flex flex-col space-y-6 min-h-[100px] justify-center">
          <div className="relative">
            <span className="absolute -top-6 -left-2 text-5xl opacity-10 pointer-events-none select-none">“</span>
            <p className="text-lg sm:text-xl font-serif-sc font-medium relative z-10 leading-relaxed text-center sm:text-left">
              {currentQuote.text}
            </p>
          </div>
          <div className="flex items-center justify-end space-x-2">
            <div className="h-px w-6 bg-gray-300 dark:bg-gray-600 opacity-50"></div>
            <p className="text-xs font-inter opacity-60 italic">{currentQuote.author}</p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
          <div className="flex items-center space-x-1">
            <button onClick={nextRandomQuote} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors" title="换一个">
              <RefreshCw size={16} className="opacity-60" />
            </button>
            <button onClick={() => setShowList(true)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors" title="查看全部">
              <List size={16} className="opacity-60" />
            </button>
            <button onClick={fetchAIQuote} disabled={isLoadingAI} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors" title="AI灵感">
              <Sparkles size={16} className={`${isLoadingAI ? 'animate-spin' : ''} text-blue-500 opacity-80`} />
            </button>
          </div>

          <div className="flex items-center space-x-1">
            <button onClick={() => setTheme(t => t === Theme.LIGHT ? Theme.DARK : t === Theme.DARK ? Theme.NOTION : Theme.LIGHT)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors" title="深色模式">
              <Settings size={16} className="opacity-60" />
            </button>
            <button onClick={() => setShowHelp(true)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors" title="使用说明">
              <HelpCircle size={16} className="opacity-30" />
            </button>
          </div>
        </div>
      </div>

      {/* 清单弹窗 */}
      {showList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-sm max-h-[70vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 dark:border-gray-800">
            <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-[#252525]">
              <h3 className="font-bold flex items-center gap-2 text-sm">我的私人句子库 ({DEFAULT_QUOTES.length})</h3>
              <button onClick={() => setShowList(false)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><X size={18} /></button>
            </div>
            <div className="overflow-y-auto p-4 space-y-4">
              {DEFAULT_QUOTES.map((q, i) => (
                <div key={i} onClick={() => { setCurrentQuote(q); setShowList(false); }} className="p-3 rounded-lg border dark:border-gray-800 hover:border-blue-500 cursor-pointer transition-colors group">
                  <p className="text-sm mb-1 group-hover:text-blue-500">{q.text}</p>
                  <p className="text-[10px] opacity-40 text-right">— {q.author}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 帮助弹窗 */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-sm rounded-2xl shadow-2xl p-6 relative border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-200">
            <button onClick={() => setShowHelp(false)} className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"><X size={20} className="opacity-50" /></button>
            
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Github size={20} /> GitHub 私人部署指南</h3>
            
            <div className="space-y-4 text-sm leading-relaxed">
              <section>
                <h4 className="font-bold text-blue-500 mb-1">1. 创建与上传</h4>
                <p className="opacity-70">在 GitHub 创建仓库，将本应用的所有文件上传。点击 `Add file` -> `Upload files` 即可。</p>
              </section>
              <section>
                <h4 className="font-bold text-blue-500 mb-1">2. 开启网页功能</h4>
                <p className="opacity-70">进入仓库的 `Settings` -> `Pages`。在 `Branch` 下选择 `main` 分支，点击 `Save`。等一分钟，你会得到一个网址。</p>
              </section>
              <section>
                <h4 className="font-bold text-blue-500 mb-1">3. 修改句子</h4>
                <p className="opacity-70">直接在 GitHub 网页上打开 `constants.ts`，点击铅笔图标编辑，保存后 Notion 里的内容会自动更新。</p>
              </section>
            </div>
            
            <button onClick={() => setShowHelp(false)} className="w-full mt-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors">
              准备好了，去操作
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
