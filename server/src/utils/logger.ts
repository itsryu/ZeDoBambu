enum LogLevel {
    ERROR = 'ERROR',
    WARN = 'WARN',
    INFO = 'INFO',
    HTTP = 'HTTP',
    VERBOSE = 'VERBOSE',
    DEBUG = 'DEBUG',
    SILLY = 'SILLY'
}

type LogLevelStrings = keyof typeof LogLevel;

class Logger {
    private static environment: string = process.env.STATE ?? 'development';
    private static readonly colors = {
        ERROR: '\x1b[31m', // red
        WARN: '\x1b[33m', // yellow
        INFO: '\x1b[32m', // green
        HTTP: '\x1b[36m', // cyan
        VERBOSE: '\x1b[34m', // blue
        DEBUG: '\x1b[35m', // magenta
        SILLY: '\x1b[37m'  // white
    };
    private static readonly resetColor = '\x1b[0m';

    private static getTimestamp(): string {
        return new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    }

    private static formatMessage(level: LogLevelStrings, message: string, meta?: string): string {
        const timestamp = Logger.getTimestamp();
        const color = Logger.colors[level];
        const metaPart = meta ? ` [${meta}]` : '';
        return `${color}[${timestamp}] [${level}] [${Logger.environment}]${metaPart} ${message}${Logger.resetColor}`;
    }

    private static log(level: LogLevelStrings, message: string, meta?: string): void {
        const formattedMessage = Logger.formatMessage(level, message, meta);
        const outputMethod = level === 'ERROR' ? console.error : 
                           level === 'WARN' ? console.warn : 
                           console.log;
        
        outputMethod(formattedMessage);
    }

    public static debug(message: string | string[] | undefined, meta: string | string[] | undefined): void {
        if (message && Array.isArray(message)) message = message.join(' ');
        if (meta && Array.isArray(meta)) meta = meta.join(' - ');
        if (!message) message = '';

        Logger.log('DEBUG', message, meta);
    }

    public static info(message: string | string[] | undefined, meta: string | string[] | undefined): void {
        if (message && Array.isArray(message)) message = message.join(' ');
        if (meta && Array.isArray(meta)) meta = meta.join(' - ');
        if (!message) message = '';

        Logger.log('INFO', message, meta);
    }

    public static warn(message: string | string[] | undefined, meta: string | string[] | undefined): void {
        if (message && Array.isArray(message)) message = message.join(' ');
        if (meta && Array.isArray(meta)) meta = meta.join(' - ');
        if (!message) message = '';

        Logger.log('WARN', message, meta);
    }

    public static error(message: string | string[] | undefined, meta: string | string[] | undefined): void {
        if (message && Array.isArray(message)) message = message.join(' ');
        if (meta && Array.isArray(meta)) meta = meta.join(' - ');
        if (!message) message = '';

        Logger.log('ERROR', message, meta);
    }
}

export { Logger };