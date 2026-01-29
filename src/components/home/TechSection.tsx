import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { GitBranch, Star, GitFork, Users } from "lucide-react";

// Animated terminal
const AnimatedTerminal = () => {
  const [lines, setLines] = useState<string[]>([]);
  const terminalRef = useRef(null);
  const isInView = useInView(terminalRef, { once: true });
  const indexRef = useRef(0);

  const commands = [
    "$ brew install naveye",
    "==> Downloading NavEye v1.2.0...",
    "==> Installing dependencies...",
    "==> Configuring eye-tracking module...",
    "==> Setting up accessibility permissions...",
    "✓ NavEye installed successfully!",
    "$ naveye start",
    "🔵 Eye tracking initialized",
    "🟣 Scroll control active",
    "✨ Ready to scroll with your eyes!",
  ];

  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      if (indexRef.current < commands.length) {
        const currentCommand = commands[indexRef.current];
        if (currentCommand) {
          setLines(prev => [...prev, currentCommand]);
        }
        indexRef.current++;
      } else {
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [isInView]);

  const getLineColor = (line: string) => {
    if (!line) return "text-muted-foreground";
    if (line.startsWith("$")) return "text-primary";
    if (line.startsWith("✓") || line.startsWith("✨")) return "text-green-400";
    if (line.startsWith("🔵")) return "text-blue-400";
    if (line.startsWith("🟣")) return "text-purple-400";
    return "text-muted-foreground";
  };

  return (
    <div 
      ref={terminalRef}
      className="glass-card rounded-xl overflow-hidden"
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-4 text-xs text-muted-foreground font-mono">terminal</span>
      </div>
      
      {/* Terminal content */}
      <div className="p-4 font-mono text-sm h-64 overflow-hidden">
        {lines.filter(Boolean).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`mb-1 ${getLineColor(line)}`}
          >
            {line}
          </motion.div>
        ))}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-2 h-4 bg-primary ml-1"
        />
      </div>
    </div>
  );
};

// GitHub stats
const GitHubStats = () => {
  const stats = [
    { icon: Star, label: "Stars", value: "2.4k", color: "#f59e0b" },
    { icon: GitFork, label: "Forks", value: "156", color: "#4A90E2" },
    { icon: Users, label: "Contributors", value: "23", color: "#9B59B6" },
    { icon: GitBranch, label: "Releases", value: "12", color: "#22c55e" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="glass-card p-4 text-center group hover:border-primary/30 transition-colors"
        >
          <stat.icon 
            className="w-6 h-6 mx-auto mb-2" 
            style={{ color: stat.color }}
          />
          <div className="text-2xl font-bold mb-1">{stat.value}</div>
          <div className="text-xs text-muted-foreground">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

// Node graph diagram
const NodeGraph = () => {
  const nodes = [
    { id: "webcam", label: "Webcam", x: 50, y: 50, color: "#4A90E2" },
    { id: "face", label: "Face Detection", x: 200, y: 30, color: "#9B59B6" },
    { id: "eye", label: "Eye Tracking", x: 200, y: 90, color: "#9B59B6" },
    { id: "gesture", label: "Gesture Recognition", x: 350, y: 50, color: "#E74C3C" },
    { id: "scroll", label: "Scroll Control", x: 500, y: 50, color: "#22c55e" },
  ];

  const connections = [
    { from: "webcam", to: "face" },
    { from: "webcam", to: "eye" },
    { from: "face", to: "gesture" },
    { from: "eye", to: "gesture" },
    { from: "gesture", to: "scroll" },
  ];

  return (
    <div className="glass-card p-6 relative h-40 overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 600 120">
        {/* Connections */}
        {connections.map((conn, i) => {
          const from = nodes.find(n => n.id === conn.from)!;
          const to = nodes.find(n => n.id === conn.to)!;
          return (
            <motion.line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="url(#lineGradient)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 1, delay: i * 0.2 }}
              viewport={{ once: true }}
            />
          );
        })}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4A90E2" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#9B59B6" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.g
            key={node.id}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.15 }}
            viewport={{ once: true }}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r="20"
              fill={`${node.color}20`}
              stroke={node.color}
              strokeWidth="2"
            />
            <text
              x={node.x}
              y={node.y + 35}
              textAnchor="middle"
              fill="currentColor"
              fontSize="10"
              className="text-muted-foreground"
            >
              {node.label}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
};

export const TechSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span 
            className="inline-block text-accent text-sm font-medium mb-4 tracking-wider uppercase"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Technology
          </motion.span>
          <h2 className="section-title mb-4">Under the hood</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powered by advanced computer vision and machine learning, all running locally on your device.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4">Processing Pipeline</h3>
            <NodeGraph />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4">Quick Install</h3>
            <AnimatedTerminal />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12"
        >
          <h3 className="text-lg font-semibold mb-4 text-center">Open Source</h3>
          <div className="max-w-md mx-auto">
            <GitHubStats />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
