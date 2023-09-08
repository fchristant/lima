"use client";

import './huelighttoggle.css'

interface HueLightToggleProps {
    light: string;
    on: boolean;
    reachable: boolean;
}

const HUE_API_BASE_URL = `${process.env.NEXT_PUBLIC_HUE_API_ADDRESS}/api/${process.env.NEXT_PUBLIC_HUE_API_USERNAME}/lights`;

export default function HueLightToggle({ light, on, reachable }: HueLightToggleProps) {

    async function toggleLight(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        const bodyData = { on: !on };

        try {
            const response = await fetch(`${HUE_API_BASE_URL}/${light}/state`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            });
            const data = await response.json();

            if (data[0]?.error) {
                console.error('Error:', data[0].error.description);
                // Consider adding user feedback here.
            }
        } catch (error) {
            console.error('Error:', error);
            // Consider adding user feedback here.
        }
    }

    return (
        <button className='hue-light-switch' onClick={toggleLight} disabled={!reachable}>
            {on ? 'off' : 'on'}
        </button>
    );
}
