import java.io.*;
import java.util.*;

public class PizzaDeliveryTSP {
    private static final String FILE_PATH = "X:\\deliveries.csv"; // Update this path to the location of your CSV file
    private static final int NUM_HOUSES = 100;

    public static void main(String[] args) {
        String[] addresses = new String[NUM_HOUSES];
        int[][] distances = loadDistanceMatrix(new File(FILE_PATH), addresses);
        if (distances == null) {
            System.out.println("Failed to load distances.");
            return;
        }

        int totalDistance = 0;
        boolean[] visited = new boolean[NUM_HOUSES];
        int currentHouse = 0; // Assuming Apache Pizza is at index 0
        visited[currentHouse] = true;

        List<Integer> route = new ArrayList<>();
        route.add(currentHouse);

        for (int i = 1; i < NUM_HOUSES; i++) {
            int nextHouse = -1;
            int minDistance = Integer.MAX_VALUE;

            for (int j = 0; j < NUM_HOUSES; j++) {
                if (!visited[j] && distances[currentHouse][j] < minDistance) {
                    minDistance = distances[currentHouse][j];
                    nextHouse = j;
                }
            }

            visited[nextHouse] = true;
            route.add(nextHouse);
            totalDistance += minDistance;
            currentHouse = nextHouse;
        }

        // Returning to Apache Pizza
        totalDistance += distances[currentHouse][0];
        route.add(0);

        System.out.println("Total distance: " + totalDistance + " meters");
        System.out.println("Route Addresses:");
        for (Integer index : route) {
            System.out.println(addresses[index]);
        }
    }

    private static int[][] loadDistanceMatrix(File file, String[] addresses) {
        int[][] distances = new int[NUM_HOUSES][NUM_HOUSES];
        try (Scanner scanner = new Scanner(file)) {
            for (int i = 0; i < NUM_HOUSES; i++) {
                String line = scanner.nextLine();
                String[] parts = line.split(",");
                addresses[i] = parts[0]; // Storing the address
                for (int j = 0; j < NUM_HOUSES; j++) {
                    distances[i][j] = Integer.parseInt(parts[j + 1].trim());
                }
            }
        } catch (Exception e) {
            System.err.println("Error reading file: " + e.getMessage());
            return null;
        }
        return distances;
    }
}
