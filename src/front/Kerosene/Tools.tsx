// import * as React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

const Tools = () => (
  <Tooltip.Provider>
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <a href='https://www.radix-ui.com/'>Radix UI</a>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          className='TooltipContent'
          sideOffset={2}
        >
          {/* <Tooltip.Arrow /> */}
          Here's a tip!
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
);

export default Tools;
