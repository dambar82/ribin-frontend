

export function classNames(...args: (string | undefined)[]): string {
   const classes = [];

   for (var i = 0; i < args.length; i++) {
      const arg = args[i];

      if ( !arg ) continue;

      classes.push(arg)
   }

   return classes.join(' ');
}