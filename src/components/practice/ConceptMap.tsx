'use client';

import { useEffect, useState } from 'react';
import { Network } from 'lucide-react';

export interface ConceptNode {
    id: string;
    label: string;
    status: 'explored' | 'current' | 'upcoming';
    parentId?: string;
}

interface ConceptMapProps {
    nodes: ConceptNode[];
    isVisible: boolean;
}

export default function ConceptMap({ nodes, isVisible }: ConceptMapProps) {
    const [animatedNodes, setAnimatedNodes] = useState<string[]>([]);

    // Animate nodes appearing one by one
    useEffect(() => {
        if (!isVisible || nodes.length === 0) {
            setAnimatedNodes([]);
            return;
        }

        const newNodeIds = nodes.map(n => n.id).filter(id => !animatedNodes.includes(id));

        newNodeIds.forEach((id, idx) => {
            setTimeout(() => {
                setAnimatedNodes(prev => [...prev, id]);
            }, idx * 300);
        });
    }, [nodes, isVisible]);

    if (!isVisible || nodes.length === 0) return null;

    // Build tree structure
    const rootNodes = nodes.filter(n => !n.parentId);
    const getChildren = (parentId: string) => nodes.filter(n => n.parentId === parentId);

    const renderNode = (node: ConceptNode, level: number = 0) => {
        const children = getChildren(node.id);
        const isAnimated = animatedNodes.includes(node.id);

        return (
            <div key={node.id} className="flex flex-col items-center">
                {/* Node */}
                <div
                    className={`
                        relative px-3 py-1.5 rounded-lg text-xs font-medium
                        transition-all duration-500 transform
                        ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
                        ${node.status === 'current'
                            ? 'bg-orange-500 text-white shadow-lg ring-2 ring-orange-300 animate-pulse'
                            : node.status === 'explored'
                                ? 'bg-green-100 text-green-800 border border-green-300'
                                : 'bg-gray-100 text-gray-500 border border-gray-200'
                        }
                    `}
                >
                    {node.label}
                    {node.status === 'current' && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-300 rounded-full animate-ping" />
                    )}
                </div>

                {/* Children */}
                {children.length > 0 && (
                    <div className="flex flex-col items-center mt-2">
                        {/* Connector line */}
                        <div className={`w-0.5 h-4 transition-all duration-300 ${isAnimated ? 'bg-gray-300' : 'bg-transparent'
                            }`} />

                        {/* Child nodes container */}
                        <div className="flex gap-4">
                            {children.map(child => (
                                <div key={child.id} className="flex flex-col items-center">
                                    {/* Horizontal connector */}
                                    <div className={`w-0.5 h-2 transition-all duration-300 ${animatedNodes.includes(child.id) ? 'bg-gray-300' : 'bg-transparent'
                                        }`} />
                                    {renderNode(child, level + 1)}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200 shadow-sm max-h-48 overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                    <Network className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-gray-900">Live Concept Map</h4>
                    <p className="text-[10px] text-gray-500">Tracking your learning path</p>
                </div>
            </div>

            {/* Legend */}
            <div className="flex gap-3 mb-4 text-[10px]">
                <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-orange-500 rounded-full" />
                    <span className="text-gray-600">Current</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-gray-600">Explored</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-gray-300 rounded-full" />
                    <span className="text-gray-600">Upcoming</span>
                </div>
            </div>

            {/* Concept Tree */}
            <div className="flex justify-center overflow-x-auto py-2">
                <div className="flex gap-6">
                    {rootNodes.map(node => renderNode(node))}
                </div>
            </div>
        </div>
    );
}
