import React from 'react';
import {CarVariant, ProxyCar} from './ProxyCar';

// Single entry point for the car. Swaps to Vi3W's real GLB (src/captures.ts `models`) once exported.
export const Car: React.FC<{variant: CarVariant; wire?: number; thrust?: number}> = (props) => <ProxyCar {...props} />;
