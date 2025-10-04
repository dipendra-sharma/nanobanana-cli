import chalk from 'chalk';

export class Logger {
  static info(message: string): void {
    console.log(chalk.blue('ℹ'), message);
  }

  static success(message: string): void {
    console.log(chalk.green('✓'), message);
  }

  static error(message: string): void {
    console.error(chalk.red('✗'), message);
  }

  static warn(message: string): void {
    console.warn(chalk.yellow('⚠'), message);
  }

  static debug(message: string): void {
    if (process.env.DEBUG) {
      console.log(chalk.gray('[DEBUG]'), message);
    }
  }

  static section(title: string): void {
    console.log('\n' + chalk.bold.underline(title) + '\n');
  }

  static result(label: string, value: string): void {
    console.log(chalk.cyan(label + ':'), chalk.white(value));
  }
}
