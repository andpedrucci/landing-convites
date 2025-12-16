'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Pause, Play } from 'lucide-react';

interface Photo {
  id: number;
  x: number;
  y: number;
  rotation: number;
  zIndex: number;
  image: string;
  title: string;
}

export default function InteractivePhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [draggedPhoto, setDraggedPhoto] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isInteractionStarted, setIsInteractionStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Inicializar fotos com posições aleatórias
  useEffect(() => {
    const templates = [
      { title: 'Chá Revelação Delicado', image: '/placeholder-1.jpg' },
      { title: '1º Aninho Floral', image: '/placeholder-2.jpg' },
      { title: 'Batizado Clássico', image: '/placeholder-3.jpg' },
      { title: 'Chá de Bebê Aquarela', image: '/placeholder-4.jpg' },
      { title: 'Mesversário Minimalista', image: '/placeholder-5.jpg' },
    ];

    const canvasWidth = 1200;
    const canvasHeight = 700;
    const cardWidth = 280;
    const cardHeight = 380;

    const initialPhotos = templates.map((template, index) => ({
      id: index,
      x: Math.random() * (canvasWidth - cardWidth - 100) + 50,
      y: Math.random() * (canvasHeight - cardHeight - 100) + 50,
      rotation: Math.random() * 24 - 12,
      zIndex: index,
      image: template.image,
      title: template.title,
    }));

    setPhotos(initialPhotos);
  }, []);

  // Inicializar áudio
  useEffect(() => {
    audioRef.current = new Audio('/sunshine.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
  }, []);

  // Efeito Magnetic Repel
  useEffect(() => {
    if (isInteractionStarted || !canvasRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });
    };

    const canvas = canvasRef.current;
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => canvas.removeEventListener('mousemove', handleMouseMove);
  }, [isInteractionStarted]);

const startInteraction = () => {
  if (!isInteractionStarted) {
    setIsInteractionStarted(true);
    
    if (audioRef.current) {
      // Começa com volume 0 (silêncio)
      audioRef.current.volume = 0;
      
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setTimeout(() => setShowPlayer(true), 500);
        
        // Fade in: aumenta volume gradualmente em 2 segundos
        const fadeInDuration = 2000; // 2 segundos
        const targetVolume = 0.3;
        const steps = 50; // quantidade de steps
        const stepDuration = fadeInDuration / steps;
        const volumeIncrement = targetVolume / steps;
        
        let currentStep = 0;
        const fadeInterval = setInterval(() => {
          if (currentStep < steps && audioRef.current) {
            audioRef.current.volume = Math.min(volumeIncrement * currentStep, targetVolume);
            currentStep++;
          } else {
            clearInterval(fadeInterval);
            if (audioRef.current) {
              audioRef.current.volume = targetVolume;
            }
          }
        }, stepDuration);
      }).catch(err => console.log('Autoplay prevented:', err));
    }
  }
};

  const handleMouseDown = (e: React.MouseEvent, photoId: number) => {
    startInteraction();
    
    const photo = photos.find(p => p.id === photoId);
    if (!photo || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setDraggedPhoto(photoId);
    setDragOffset({
      x: mouseX - photo.x,
      y: mouseY - photo.y,
    });

    setPhotos(prev => prev.map(p => 
      p.id === photoId 
        ? { ...p, zIndex: Math.max(...prev.map(ph => ph.zIndex)) + 1 }
        : p
    ));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedPhoto === null || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    let newX = e.clientX - rect.left - dragOffset.x;
    let newY = e.clientY - rect.top - dragOffset.y;

    const cardWidth = 280;
    const cardHeight = 380;
    newX = Math.max(0, Math.min(newX, rect.width - cardWidth));
    newY = Math.max(0, Math.min(newY, rect.height - cardHeight));

    setPhotos(prev => prev.map(p =>
      p.id === draggedPhoto ? { ...p, x: newX, y: newY } : p
    ));
  };

  const handleMouseUp = () => {
    setDraggedPhoto(null);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const getPhotoStyle = (photo: Photo) => {
    let x = photo.x;
    let y = photo.y;

    if (!isInteractionStarted && mousePos.x && mousePos.y) {
      const dx = photo.x + 140 - mousePos.x;
      const dy = photo.y + 190 - mousePos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const repelRadius = 150;

      if (distance < repelRadius) {
        const force = (repelRadius - distance) / repelRadius;
        x += (dx / distance) * force * 30;
        y += (dy / distance) * force * 30;
      }
    }

    return {
      transform: `translate(${x}px, ${y}px) rotate(${photo.rotation}deg)`,
      zIndex: photo.zIndex,
      transition: draggedPhoto === photo.id ? 'none' : 'transform 0.3s ease-out',
    };
  };

  return (
    <>
      <section className="py-28 px-6 bg-gradient-to-b from-beige-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-serif text-brown-700 mb-6">
              Explore nossos
              <br />
              <span className="text-beige-300 italic">templates</span>
            </h2>
            <p className="text-lg text-brown-600 font-light mb-8">
              {!isInteractionStarted 
                ? "Passe o mouse e interaja com os convites" 
                : "Arraste e explore cada modelo"}
            </p>
          </div>

          <div className="flex justify-center">
            <div 
              ref={canvasRef}
              className="relative w-full max-w-[1200px] h-[700px] bg-gradient-to-br from-beige-100/30 to-rose-100/20 rounded-3xl border-2 border-beige-200/30 overflow-hidden"
              style={{ cursor: isInteractionStarted ? 'default' : 'pointer' }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="absolute w-[280px] h-[380px] bg-white rounded-2xl shadow-2xl cursor-grab active:cursor-grabbing hover:shadow-3xl"
                  style={getPhotoStyle(photo)}
                  onMouseDown={(e) => handleMouseDown(e, photo.id)}
                >
                  <div className="w-full h-full rounded-2xl overflow-hidden p-4 flex flex-col">
                    <div className="flex-1 bg-gradient-to-br from-beige-100 to-rose-100 rounded-xl flex items-center justify-center mb-4">
                      <div className="text-center p-6">
                        <p className="text-6xl mb-4">
                          {photo.id === 0 ? '🤱' : photo.id === 1 ? '🎂' : photo.id === 2 ? '✨' : photo.id === 3 ? '🍼' : '🎈'}
                        </p>
                        <p className="text-brown-600 font-serif text-lg">{photo.title}</p>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-brown-600/70 font-medium">Template {photo.id + 1}</p>
                    </div>
                  </div>

                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-8 bg-beige-200/60 backdrop-blur-sm rotate-0 shadow-sm" />
                </div>
              ))}

              {!isInteractionStarted && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-xl border border-beige-300/50 animate-pulse">
                    <p className="text-brown-600 font-medium flex items-center gap-2">
                      <span className="text-2xl">👆</span>
                      Passe o mouse e clique para explorar
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-brown-600/70 text-sm max-w-2xl mx-auto">
              Cada template pode ser totalmente personalizado no Canva. 
              Você recebe o link editável + arquivos PNG e PDF prontos.
            </p>
          </div>
        </div>
      </section>

      {showPlayer && (
        <div 
          className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-beige-200 shadow-2xl z-50 transition-all duration-500 ${
            showPlayer ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlayPause}
                className="w-10 h-10 rounded-full bg-beige-300 text-white flex items-center justify-center hover:bg-beige-400 transition-all hover:scale-110 shadow-lg"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              
              <div>
                <p className="text-sm font-medium text-brown-700">You Are My Sunshine</p>
                <p className="text-xs text-brown-600/60">Versão Instrumental</p>
              </div>
            </div>

            <button
              onClick={toggleMute}
              className="w-10 h-10 rounded-full bg-beige-100 text-beige-300 flex items-center justify-center hover:bg-beige-200 transition-all"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
