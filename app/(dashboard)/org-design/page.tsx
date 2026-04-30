"use client";

import { useCallback, useState } from "react";
import {
  ReactFlow, addEdge, Background, Controls, MiniMap, useEdgesState, useNodesState,
  type Connection, type Edge, type Node, Handle, Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion } from "framer-motion";
import { Users, AlertTriangle, CheckCircle, MinusCircle, Sparkles, Download } from "lucide-react";
import { cn } from "@/lib/utils";

// Custom Node
function OrgNode({ data }: { data: any }) {
  const spanColor = data.span > 10 ? "text-[#F87171] border-[#EF4444]/30" : data.span < 4 ? "text-[#FCD34D] border-[#F59E0B]/30" : "text-[#34D399] border-[#10B981]/30";
  return (
    <>
      <Handle type="target" position={Position.Top} style={{ background: "rgba(255,255,255,0.2)" }} />
      <div className={cn(
        "rounded-xl border px-4 py-3 min-w-[180px] shadow-lg",
        data.isDigitalLabor ? "border-[#8B5CF6]/40 bg-[#8B5CF6]/10" : "border-white/10 bg-[#1A2235]"
      )}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="text-xs font-bold text-white leading-tight">{data.title}</div>
            <div className="text-[10px] text-[#94A3B8] mt-0.5">{data.bu}</div>
          </div>
          {data.isDigitalLabor
            ? <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#8B5CF6]/20 text-[#A78BFA] border border-[#8B5CF6]/30">AGENT</span>
            : <span className="text-[10px] font-mono text-[#94A3B8]">{data.grade}</span>
          }
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[10px]">
            <Users className="w-3 h-3 text-[#94A3B8]" />
            <span className="text-[#94A3B8]">{data.hc} FTE</span>
          </div>
          {data.span !== undefined && (
            <div className={cn("text-[10px] font-mono px-1.5 py-0.5 rounded border", spanColor)}>
              Span:{data.span}
            </div>
          )}
        </div>
        {data.openReqs > 0 && (
          <div className="mt-1.5 text-[10px] text-[#F59E0B]">{data.openReqs} open req{data.openReqs > 1 ? "s" : ""}</div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: "rgba(255,255,255,0.2)" }} />
    </>
  );
}

const nodeTypes = { orgNode: OrgNode };

const INITIAL_NODES: Node[] = [
  { id: "ceo", type: "orgNode", position: { x: 400, y: 20 }, data: { title: "Chief Executive Officer", bu: "Executive", grade: "L10", hc: 1, span: 6, openReqs: 0 } },
  { id: "cro", type: "orgNode", position: { x: 100, y: 160 }, data: { title: "VP Sales", bu: "Sales", grade: "L8", hc: 580, span: 8, openReqs: 4 } },
  { id: "cto", type: "orgNode", position: { x: 350, y: 160 }, data: { title: "CTO", bu: "Engineering", grade: "L9", hc: 720, span: 5, openReqs: 12 } },
  { id: "cmo", type: "orgNode", position: { x: 600, y: 160 }, data: { title: "VP Marketing", bu: "Marketing", grade: "L8", hc: 210, span: 7, openReqs: 2 } },
  { id: "coo", type: "orgNode", position: { x: 750, y: 160 }, data: { title: "VP Operations", bu: "Ops", grade: "L8", hc: 340, span: 9, openReqs: 3 } },
  { id: "sales_mgr", type: "orgNode", position: { x: 0, y: 320 }, data: { title: "Sales Manager - ENT", bu: "Sales", grade: "L6", hc: 120, span: 8, openReqs: 1 } },
  { id: "sdr_mgr", type: "orgNode", position: { x: 200, y: 320 }, data: { title: "SDR Manager", bu: "Sales", grade: "L5", hc: 45, span: 12, openReqs: 2 } },
  { id: "eng_mgr1", type: "orgNode", position: { x: 310, y: 320 }, data: { title: "Eng Manager - Platform", bu: "Eng", grade: "L6", hc: 72, span: 7, openReqs: 3 } },
  { id: "ml_mgr", type: "orgNode", position: { x: 490, y: 320 }, data: { title: "ML Engineering Manager", bu: "Eng/AI", grade: "L6", hc: 28, span: 4, openReqs: 4 } },
  { id: "ai_sdr", type: "orgNode", position: { x: 200, y: 460 }, data: { title: "AI Sales Agent", bu: "Sales", grade: "AGENT", hc: 4.2, span: 0, openReqs: 0, isDigitalLabor: true } },
];

const INITIAL_EDGES: Edge[] = [
  { id: "e1", source: "ceo", target: "cro", style: { stroke: "#2563EB", strokeWidth: 1.5 } },
  { id: "e2", source: "ceo", target: "cto", style: { stroke: "#2563EB", strokeWidth: 1.5 } },
  { id: "e3", source: "ceo", target: "cmo", style: { stroke: "#2563EB", strokeWidth: 1.5 } },
  { id: "e4", source: "ceo", target: "coo", style: { stroke: "#2563EB", strokeWidth: 1.5 } },
  { id: "e5", source: "cro", target: "sales_mgr", style: { stroke: "#94A3B8", strokeWidth: 1 } },
  { id: "e6", source: "cro", target: "sdr_mgr", style: { stroke: "#F59E0B", strokeWidth: 1, strokeDasharray: "4 3" } },
  { id: "e7", source: "cto", target: "eng_mgr1", style: { stroke: "#94A3B8", strokeWidth: 1 } },
  { id: "e8", source: "cto", target: "ml_mgr", style: { stroke: "#94A3B8", strokeWidth: 1 } },
  { id: "e9", source: "sdr_mgr", target: "ai_sdr", style: { stroke: "#8B5CF6", strokeWidth: 1, strokeDasharray: "5 3" } },
];

export default function OrgDesignPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
  const [view, setView] = useState<"canvas" | "distribution">("canvas");

  const onConnect = useCallback((connection: Connection) => setEdges((eds) => addEdge(connection, eds)), [setEdges]);

  const spanIssues = nodes.filter((n: Node) => (n.data as any).span > 10 || ((n.data as any).span < 4 && (n.data as any).span > 0));

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] space-y-4">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-syne, Syne)" }}>Org Design Canvas</h1>
          <p className="text-sm text-[#94A3B8] mt-1">Interactive org chart with span-of-control analysis</p>
        </div>
        <div className="flex items-center gap-2">
          {(["canvas", "distribution"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn("px-3 py-1.5 rounded-lg text-sm border transition-all capitalize",
                view === v ? "bg-[#2563EB]/15 border-[#2563EB]/40 text-white" : "border-white/8 text-[#94A3B8]")}
            >
              {v}
            </button>
          ))}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/8 text-[#94A3B8] text-sm hover:text-white transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Span of control alerts */}
      {spanIssues.length > 0 && (
        <div className="shrink-0 flex flex-wrap gap-2">
          {spanIssues.map((n: Node) => {
            const d = n.data as any;
            const isOver = d.span > 10;
            return (
              <div key={n.id} className={cn("flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-lg border",
                isOver ? "bg-[#EF4444]/10 border-[#EF4444]/25 text-[#F87171]" : "bg-[#F59E0B]/10 border-[#F59E0B]/25 text-[#FCD34D]"
              )}>
                <AlertTriangle className="w-3 h-3" />
                {d.title}: Span {d.span} {isOver ? "(over-spanned)" : "(under-spanned)"}
              </div>
            );
          })}
        </div>
      )}

      {view === "canvas" ? (
        <div className="flex-1 rounded-xl border border-white/8 overflow-hidden" style={{ background: "#0A0D14" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
          >
            <Background color="rgba(255,255,255,0.04)" gap={24} />
            <Controls style={{ background: "#1A2235", border: "1px solid rgba(255,255,255,0.08)" }} />
            <MiniMap
              style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)" }}
              nodeColor="#2563EB"
            />
          </ReactFlow>
        </div>
      ) : (
        <div className="flex-1 overflow-auto grid grid-cols-3 gap-4">
          {[
            { label: "Sales", grades: { L8: 1, L6: 4, L5: 12, L4: 38, L3: 85, L2: 142 } },
            { label: "Engineering", grades: { L9: 1, L7: 8, L6: 18, L5: 120, L4: 210, L3: 180, L2: 183 } },
            { label: "Marketing", grades: { L8: 1, L6: 5, L5: 22, L4: 48, L3: 68, L2: 66 } },
          ].map((bu) => (
            <div key={bu.label} className="rounded-xl border border-white/8 p-5" style={{ background: "var(--swop-card)" }}>
              <h3 className="text-sm font-semibold text-white mb-4" style={{ fontFamily: "var(--font-syne, Syne)" }}>{bu.label}</h3>
              <div className="space-y-2">
                {Object.entries(bu.grades).map(([grade, count]) => {
                  const total = Object.values(bu.grades).reduce((a, b) => a + b, 0);
                  const pct = (count / total) * 100;
                  return (
                    <div key={grade} className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[#94A3B8] w-5">{grade}</span>
                      <div className="flex-1 h-5 rounded bg-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6 }}
                          className="h-full rounded"
                          style={{ background: `hsl(${221 - Number(grade.replace("L", "")) * 15}, 80%, 60%)` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-white w-8 text-right">{count}</span>
                      <span className="text-[11px] text-[#94A3B8] w-8">{pct.toFixed(0)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
