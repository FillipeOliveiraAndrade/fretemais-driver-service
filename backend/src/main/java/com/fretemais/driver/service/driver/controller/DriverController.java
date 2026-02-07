package com.fretemais.driver.service.driver.controller;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fretemais.driver.service.driver.domain.Driver;
import com.fretemais.driver.service.driver.domain.VehicleType;
import com.fretemais.driver.service.driver.dto.DriverCreateRequest;
import com.fretemais.driver.service.driver.dto.DriverFilter;
import com.fretemais.driver.service.driver.dto.DriverResponse;
import com.fretemais.driver.service.driver.dto.DriverSortBy;
import com.fretemais.driver.service.driver.dto.DriverUpdateRequest;
import com.fretemais.driver.service.driver.service.DriverService;

import com.fretemais.driver.service.common.api.ApiError;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/drivers")
@RequiredArgsConstructor
@Validated
@Tag(name = "Drivers", description = "Operacoes de cadastro, consulta e busca de motoristas.")
public class DriverController {

    private final DriverService driverService;

    @PostMapping
    @Operation(
            summary = "Criar motorista",
            description = "Cria um novo motorista com dados basicos e tipos de veiculo.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "Motorista criado",
                    content = @Content(schema = @Schema(implementation = DriverResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Dados invalidos",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Nao autorizado",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            )
    })
    public ResponseEntity<DriverResponse> create(@Valid @RequestBody DriverCreateRequest request) {
        Driver driver = driverService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(driver));
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Detalhar motorista",
            description = "Retorna os dados completos de um motorista.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Motorista encontrado",
                    content = @Content(schema = @Schema(implementation = DriverResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Motorista nao encontrado",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Nao autorizado",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            )
    })
    public ResponseEntity<DriverResponse> findById(@PathVariable UUID id) {
        Driver driver = driverService.findById(id);
        return ResponseEntity.ok(toResponse(driver));
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Atualizar motorista",
            description = "Atualiza todos os dados de um motorista.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Motorista atualizado",
                    content = @Content(schema = @Schema(implementation = DriverResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Dados invalidos",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Motorista nao encontrado",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Nao autorizado",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            )
    })
    public ResponseEntity<DriverResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody DriverUpdateRequest request) {
        Driver driver = driverService.update(id, request);
        return ResponseEntity.ok(toResponse(driver));
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Excluir motorista",
            description = "Remove (soft delete) um motorista.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "204",
                    description = "Motorista removido"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Motorista nao encontrado",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Nao autorizado",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            )
    })
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        driverService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @Operation(
            summary = "Buscar motoristas",
            description = "Busca paginada com filtros combinaveis e ordenacao.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista paginada de motoristas",
                    content = @Content(schema = @Schema(implementation = DriverResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Parametros invalidos",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Nao autorizado",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            )
    })
    public Page<DriverResponse> search(
            @Parameter(
                    in = ParameterIn.QUERY,
                    description = "Texto para buscar em nome/email/telefone",
                    example = "maria"
            )
            @RequestParam(required = false) String text,
            @Parameter(
                    in = ParameterIn.QUERY,
                    description = "Alias do parametro text (deprecated)",
                    deprecated = true
            )
            @RequestParam(name = "name", required = false) String name,
            @Parameter(
                    in = ParameterIn.QUERY,
                    description = "Cidade do motorista",
                    example = "Sao Paulo"
            )
            @RequestParam(required = false) String city,
            @Parameter(
                    in = ParameterIn.QUERY,
                    description = "UF do motorista",
                    example = "SP"
            )
            @RequestParam(required = false) String state,
            @Parameter(
                    in = ParameterIn.QUERY,
                    description = "Tipos de veiculo (1 ou mais)",
                    example = "VAN"
            )
            @RequestParam(required = false) Set<VehicleType> vehicleTypes,
            @Parameter(
                    in = ParameterIn.QUERY,
                    description = "Pagina (0-based)",
                    example = "0"
            )
            @RequestParam(defaultValue = "0") int page,
            @Parameter(
                    in = ParameterIn.QUERY,
                    description = "Tamanho da pagina",
                    example = "10"
            )
            @RequestParam(defaultValue = "5") int size,
            @Parameter(
                    in = ParameterIn.QUERY,
                    description = "Campo de ordenacao permitido",
                    example = "CREATED_AT"
            )
            @RequestParam(defaultValue = "CREATED_AT") DriverSortBy sortBy,
            @Parameter(
                    in = ParameterIn.QUERY,
                    description = "Direcao da ordenacao",
                    example = "DESC"
            )
            @RequestParam(defaultValue = "DESC") Sort.Direction sortDir) {

        String resolvedText = text != null ? text : name;

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(sortDir, sortBy.getProperty())
        );

        DriverFilter filter = new DriverFilter(
                resolvedText,
                city,
                state,
                vehicleTypes);

        return driverService.search(filter, pageable)
                .map(DriverController::toResponse);
    }

    private static DriverResponse toResponse(Driver driver) {
        Set<VehicleType> vehicleTypes = driver.getVehicleTypes() == null
                ? Set.of()
                : Arrays.stream(driver.getVehicleTypes())
                        .collect(Collectors.toSet());

        return new DriverResponse(
                driver.getId(),
                driver.getName(),
                driver.getEmail(),
                driver.getPhone(),
                driver.getCity(),
                driver.getState(),
                vehicleTypes,
                driver.isActive(),
                driver.getCreatedAt(),
                driver.getUpdatedAt()
        );
    }
}
