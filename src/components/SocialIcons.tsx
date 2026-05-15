type IconProps = {
    className?: string;
};

export const GithubIcon = ({ className }: IconProps) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.41 7.85 10.94.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.19.69-3.86-1.54-3.86-1.54-.52-1.32-1.28-1.67-1.28-1.67-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.3-.52-1.5.11-3.13 0 0 .97-.31 3.18 1.18a11.06 11.06 0 0 1 5.8 0c2.2-1.5 3.17-1.18 3.17-1.18.64 1.63.24 2.83.12 3.13.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.08.78 2.18 0 1.57-.01 2.83-.01 3.22 0 .3.2.66.79.55A11.51 11.51 0 0 0 23.5 12c0-6.27-5.23-11.5-11.5-11.5z" />
    </svg>
);

export const LinkedinIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V24h-4V8zm7 0h3.8v2.2h.05c.53-1 1.83-2.2 3.77-2.2 4.03 0 4.78 2.65 4.78 6.1V24h-4v-7.7c0-1.84-.03-4.2-2.56-4.2-2.56 0-2.95 2-2.95 4.06V24h-4V8z" />
    </svg>
);

export const InstagramIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm5 5.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm6-1.75a1.25 1.25 0 1 1-1.25-1.25A1.25 1.25 0 0 1 18 5.75zM12 9a3 3 0 1 0 3 3 3 3 0 0 0-3-3z" />
    </svg>
);

export const EmailIcon = ({ className }: IconProps) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
    </svg>
);

export const PhoneIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.24c1.1.36 2.3.56 3.6.56a1 1 0 011 1V21a1 1 0 01-1 1C10.1 22 2 13.9 2 3a1 1 0 011-1h3.5a1 1 0 011 1c0 1.3.2 2.5.56 3.6a1 1 0 01-.25 1l-2.26 2.2z" />
    </svg>
);