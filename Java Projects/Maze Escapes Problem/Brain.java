class Brain {
    private int direction; // 0: North, 1: East, 2: South, 3: West

    public Brain() 
    {
        this.direction = 0; // Start by moving North
    }

    public String getMove(boolean north, boolean south, boolean east, boolean west) {
        switch (direction) 
        {
            case 0:
                if (west) {
                    direction = 3;
                    return "west";
                } 
                else if (north) 
                {
                    return "north";
                }
                break;
            
            case 1:
                if (north) 
                {
                    direction = 0;
                    return "north";
                } 
                else if (east) 
                {
                    return "east";
                }
                break;
            
            case 2:
                if (east) 
                {
                    direction = 1;
                    return "east";
                } 
                else if (south) 
                {
                    return "south";
                }
                break;
            
            case 3:
                if (south) 
                {
                    direction = 2;
                    return "south";
                } 
                else if (west) 
                {
                    return "west";
                }
                break;
        }
        // If the preferred direction is blocked, try turning right
        for (int i = 1; i <= 3; i++) 
        {
            int newDirection = (direction + i) % 4;
            switch (newDirection) 
            {
                case 0:
                    if (north) 
                    {
                        direction = newDirection;
                        return "north";
                    }
                    break;
                case 1:
                    if (east) 
                    {
                        direction = newDirection;
                        return "east";
                    }
                    break;
                case 2:
                    if (south) 
                    {
                        direction = newDirection;
                        return "south";
                    }
                    break;
                case 3:
                    if (west) 
                    {
                        direction = newDirection;
                        return "west";
                    }
                    break;
            }
        }
        // If all options are blocked, choose a random direction
        return getRandomMove(north, south, east, west);
    }

    private String getRandomMove(boolean north, boolean south, boolean east, boolean west) {
        int random = (int) (Math.random() * 4);
        switch (random) {
            case 0:
                return north && direction != 2 ? "north" : getRandomMove(north, south, east, west);
            case 1:
                return south && direction != 0 ? "south" : getRandomMove(north, south, east, west);
            case 2:
                return east && direction != 3 ? "east" : getRandomMove(north, south, east, west);
            case 3:
                return west && direction != 1 ? "west" : getRandomMove(north, south, east, west);
            default:
                return "";
        }
    }
}