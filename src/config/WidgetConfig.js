// src/config/widgetConfig.js

// 기본 위젯 import
import CalendarWidget from '../components/widget/Basic/calendar/CalendarWidget';
import WeatherWidgetSmall from '../components/widget/Basic/weather/WeatherWidgetSmall';
import WeatherWidgetLarge from '../components/widget/Basic/weather/WeatherWidgetLarge';
import MemoWidgetSmall from '../components/widget/Basic/memo/MemoWidgetSmall';
import MemoWidgetLarge from '../components/widget/Basic/memo/MemoWidgetLarge';
import NewsWidgetSmall from '../components/widget/Basic/news/NewsWidgetSmall';
import NewsWidgetLarge from '../components/widget/Basic/news/NewsWidgetLarge';
import TranslatorWidget from '../components/widget/Basic/translator/TranslatorWidget';


// 위젯 옵션 정의
export const WIDGET_OPTIONS = [
  // 기본 위젯
  { 
    id: 'calendar', 
    name: '달력', 
    Component: CalendarWidget,
    category: 'basic'
  },
  { 
    id: 'weatherS', 
    name: '날씨 (소형)', 
    Component: WeatherWidgetSmall,
    category: 'basic'
  },
  { 
    id: 'weatherL', 
    name: '날씨 (대형)', 
    Component: WeatherWidgetLarge,
    category: 'basic'
  },
  { 
    id: 'memoS', 
    name: '메모 (소형)', 
    Component: MemoWidgetSmall,
    category: 'basic'
  },
  { 
    id: 'memoL', 
    name: '메모 (대형)', 
    Component: MemoWidgetLarge,
    category: 'basic'
  },
  { 
    id: 'newsS', 
    name: '뉴스 (소형)', 
    Component: NewsWidgetSmall,
    category: 'basic'
  },
  { 
    id: 'newsL', 
    name: '뉴스 (대형)', 
    Component: NewsWidgetLarge,
    category: 'basic'
  },
  { 
    id: 'translator', 
    name: '번역기', 
    Component: TranslatorWidget,
    category: 'basic'
  },
  
];

export default WIDGET_OPTIONS;