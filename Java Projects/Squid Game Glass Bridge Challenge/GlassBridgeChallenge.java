import java.util.Random;
import java.util.Scanner;

public class GlassBridgeChallenge {
	
	public static void main(String[] args) 
    {
    	Scanner sc = new Scanner(System.in);
        // Example: Calculate the chance of survival for the 5th player
        int n = sc.nextInt();
        int simulationCount = 100000; // Number of simulations
        
        	double survivalPercentage = monteCarloSimulation(n, simulationCount);
            System.out.println("Player " + n + " has approximately " + Math.round(survivalPercentage) + "% chance of survival.");
    
    }

    private static double monteCarloSimulation(int n, int simulationCount) 
    {
        int survivalCount = 0;

        for (int i = 0; i < simulationCount; i++) 
        {
            if (simulateGame(n)) 
            {
                survivalCount++;
            }
        }

        return ((double) survivalCount / simulationCount) * 100;
    }

    private static boolean simulateGame(int n) 
    {
        Random random = new Random();

        // Simulate the glass bridge challenge for the given player
        for (int step = 1; step <= 17; step++) 
        {
            double randomChance = random.nextDouble(); // Simulate the 1% chance of falling off
            if (randomChance <= 0.01) 
            {
                // Player falls off by accident
                return false;
            }

            // Player makes a random choice (left or right)
            boolean jumpToLeft = random.nextBoolean();

            if (step == n && jumpToLeft) 
            {
                // The player makes a jump at their step, simulate collapse
                return false;
            }
        }

        // If the loop completes without falling, the player survives
        return true;
    }
}