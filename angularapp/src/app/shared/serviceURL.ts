export class ServiceURL {
    public static HOST: string = '/api';

    public static loginURL: string =  `${ServiceURL.HOST}/accounts/login/`;
    public static logoutURL: string = `${ServiceURL.HOST}/accounts/logout/`;

    public static todoURL: string = `${ServiceURL.HOST}/todos/tasks/`;
    public static todoMarkDoneURL: string = `${ServiceURL.HOST}/todos/tasks/done/`;
    public static todoSetReminderURL: string = `${ServiceURL.HOST}/todos/tasks/set_reminder/`;

    public static todoRemindersURL: string = `${ServiceURL.HOST}/todos/reminders/`;
}
