import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, X } from 'lucide-react';
import BackgroundPlayer from '@/components/BackgroundPlayer';
import WeatherWidget from '@/components/WeatherWidget';
import Clock from '@/components/Clock';
import TodoWidget from '@/components/TodoWidget';
import AffirmationWidget from '@/components/AffirmationWidget';

type WidgetType = 'weather' | 'clock' | 'todo' | 'affirmation';

const widgetComponents: Record<WidgetType, React.FC> = {
  weather: WeatherWidget,
  clock: Clock,
  todo: TodoWidget,
  affirmation: AffirmationWidget,
};

const widgetNames: Record<WidgetType, string> = {
  weather: 'Weather',
  clock: 'Clock',
  todo: 'Todo List',
  affirmation: 'Affirmation',
};

export default function DigitalPictureFrame() {
  const [widgets, setWidgets] = useState<WidgetType[]>(['clock', 'weather', 'affirmation', 'todo']);
  const [availableWidgets] = useState<WidgetType[]>(['weather', 'clock', 'todo', 'affirmation']);
  const videoUrl = 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4';

  const addWidget = (widgetType: WidgetType) => {
    if (!widgets.includes(widgetType)) {
      setWidgets([...widgets, widgetType]);
    }
  };

  const removeWidget = (widgetType: WidgetType) => {
    setWidgets(widgets.filter(w => w !== widgetType));
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex">
      {/* Video Background */}
      <BackgroundPlayer url={videoUrl} />

      {/* Sidebar for Widgets */}
      <div className="relative z-10 ml-auto w-1/4 min-h-screen bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
        {/* Widget Area */}
        <div className="space-y-4">
          {widgets.map((widgetType) => {
            const WidgetComponent = widgetComponents[widgetType];
            return (
              <Card key={widgetType} className="relative group bg-white/10 backdrop-blur-lg border-white/20">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity text-white/70 hover:text-white hover:bg-white/10"
                  onClick={() => removeWidget(widgetType)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="p-4">
                  <WidgetComponent />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Add Widget Dropdown */}
        <div className="mt-4 space-y-2">
          {availableWidgets
            .filter(widget => !widgets.includes(widget))
            .map(widget => (
              <Button 
                key={widget}
                onClick={() => addWidget(widget)} 
                className="w-full bg-white/10 text-white hover:bg-white/20 border-white/20"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add {widgetNames[widget]}
              </Button>
            ))}
        </div>
      </div>
    </div>
  );
}