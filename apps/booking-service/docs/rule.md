### Module Dependency Rule

appointment  --> availability port only
availability --> schedule port
availability --> appointment query port
availability --> hold query port
availability --> resource query port

schedule     --> shared-kernel only
resource     --> shared-kernel only
hold         --> shared-kernel only
waitlist     --> availability port only