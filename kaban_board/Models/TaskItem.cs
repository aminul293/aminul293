public class TaskItem
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public TaskStatus Status { get; set; }
}

public enum TaskStatus
{
    ToDo,
    Doing,
    Done
}
